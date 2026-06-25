import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { MapService } from '../map/map.service';

interface PriceItem {
  part: string;
  repair: string;
  labor: number;
  parts: number;
}

// 价格表(移植自 carwork price_catalog.json；内联为常量，编译进 dist，无需拷贝资源)
const CATALOG: PriceItem[] = [
  { part: '前保险杠', repair: '喷漆', labor: 400, parts: 0 },
  { part: '前保险杠', repair: '钣金', labor: 600, parts: 0 },
  { part: '前保险杠', repair: '更换', labor: 300, parts: 1200 },
  { part: '后保险杠', repair: '喷漆', labor: 400, parts: 0 },
  { part: '后保险杠', repair: '钣金', labor: 600, parts: 0 },
  { part: '后保险杠', repair: '更换', labor: 300, parts: 1100 },
  { part: '前车门', repair: '喷漆', labor: 500, parts: 0 },
  { part: '前车门', repair: '钣金', labor: 700, parts: 0 },
  { part: '前车门', repair: '更换', labor: 400, parts: 2500 },
  { part: '后车门', repair: '喷漆', labor: 500, parts: 0 },
  { part: '后车门', repair: '钣金', labor: 700, parts: 0 },
  { part: '后车门', repair: '更换', labor: 400, parts: 2300 },
  { part: '前机盖', repair: '喷漆', labor: 600, parts: 0 },
  { part: '前机盖', repair: '钣金', labor: 800, parts: 0 },
  { part: '前机盖', repair: '更换', labor: 400, parts: 3500 },
  { part: '后备箱盖', repair: '喷漆', labor: 600, parts: 0 },
  { part: '后备箱盖', repair: '钣金', labor: 800, parts: 0 },
  { part: '后备箱盖', repair: '更换', labor: 400, parts: 3200 },
  { part: '翼子板', repair: '喷漆', labor: 350, parts: 0 },
  { part: '翼子板', repair: '钣金', labor: 500, parts: 0 },
  { part: '翼子板', repair: '更换', labor: 250, parts: 900 },
  { part: '后视镜', repair: '喷漆', labor: 100, parts: 0 },
  { part: '后视镜', repair: '更换', labor: 100, parts: 600 },
  { part: '大灯', repair: '更换', labor: 200, parts: 1800 },
  { part: '尾灯', repair: '更换', labor: 200, parts: 1200 },
  { part: '挡风玻璃', repair: '更换', labor: 200, parts: 1500 },
  { part: '车门玻璃', repair: '更换', labor: 150, parts: 500 },
];

type Args = Record<string, any>;

/**
 * Agent 的 4 个"纯数据"工具：查保单 / 查理赔 / 找修理厂 / 估价。
 * assess_damage(视觉) 因依赖 OpenAI client，放在 AgentService 里。
 * 移植自 carwork/backend/app/ai/agent/tools.py，查 carwork2 自家 Prisma。
 */
@Injectable()
export class AgentToolsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly mapService: MapService,
  ) {}

  /** 按工具名分发(不含 assess_damage) */
  async callTool(name: string, args: Args): Promise<any> {
    try {
      switch (name) {
        case 'query_policy':
          return await this.queryPolicy(args);
        case 'query_claim_status':
          return await this.queryClaimStatus(args);
        case 'search_repair_shop':
          return await this.searchRepairShop(args);
        case 'estimate_cost':
          return await this.estimateCost(args);
        default:
          return { error: `未知工具 ${name}` };
      }
    } catch (e: any) {
      return { error: `工具执行出错: ${e?.message || String(e)}` };
    }
  }

  /** 按保单号/车牌查询保单条款 */
  async queryPolicy(args: Args): Promise<any> {
    const { policy_no, plate_no } = args;
    if (!policy_no && !plate_no) {
      return { error: '请至少提供 policy_no / plate_no 之一' };
    }
    const where: any = { status: 'ACTIVE' };
    if (policy_no) where.policyNo = policy_no;
    else where.vehicle = { plateNo: { contains: plate_no } };

    const p = await this.prisma.policy.findFirst({ where, include: { vehicle: true } });
    if (!p) return { found: false, hint: '未找到在保保单，请确认信息或引导用户补充' };

    let coverages: string[] = [];
    try {
      coverages = JSON.parse(p.coverageTypes || '[]');
    } catch {
      coverages = [];
    }
    return {
      found: true,
      policy_no: p.policyNo,
      plate_no: p.vehicle?.plateNo,
      type: p.type,
      coverage_types: coverages,
      has_damage_coverage: coverages.includes('车辆损失险'),
      deductible: p.deductible,
      payout_ratio: p.payoutRatio,
      coverage_amount: p.coverageAmount,
      status: p.status,
      end_date: p.endDate,
    };
  }

  /** 按理赔编号查询案件进度 */
  async queryClaimStatus(args: Args): Promise<any> {
    const { claim_no } = args;
    if (!claim_no) return { error: '请提供 claim_no' };
    const c = await this.prisma.claim.findFirst({ where: { claimNo: claim_no } });
    if (!c) return { found: false, hint: '未找到该案件' };
    return {
      found: true,
      claim_no: c.claimNo,
      status: c.status,
      assessment_amount: c.assessmentAmount,
      final_amount: c.finalAmount,
      description: c.description,
    };
  }

  /** 按经纬度找最近修理厂 */
  async searchRepairShop(args: Args): Promise<any> {
    const { lat, lng, top_n } = args;
    if (lat == null || lng == null) return { error: '请提供 lat / lng' };
    const shops = await this.prisma.repairShop.findMany();
    if (!shops.length) return { shops: [], hint: '该区域暂无合作修理厂' };

    const scored = shops
      .map((s) => ({
        s,
        d: this.mapService.calculateDistance(Number(lat), Number(lng), s.lat, s.lng),
      }))
      .sort((a, b) => a.d - b.d);
    const n = Math.max(1, Math.min(Number(top_n) || 3, 10));
    return {
      shops: scored.slice(0, n).map(({ s, d }) => ({
        name: s.name,
        certification: s.certification,
        distance_km: Math.round(d * 100) / 100,
        base_price: s.basePrice,
        rating: s.rating,
      })),
    };
  }

  /** 按损伤清单估自费价 */
  async estimateCost(args: Args): Promise<any> {
    const damages: { part?: string; repair?: string }[] = args.damages;
    if (!Array.isArray(damages) || !damages.length) return { error: '请提供 damages 损伤清单' };

    let total = 0;
    const items = damages.map((d) => {
      const part = (d.part || '').trim();
      const repair = (d.repair || '').trim();
      const m = matchPrice(CATALOG, part, repair);
      if (m) {
        const subtotal = m.labor + m.parts;
        total += subtotal;
        return { part: part || m.part, repair: m.repair, labor: m.labor, parts: m.parts, subtotal };
      }
      return { part, repair, found: false, hint: '价格表未覆盖，建议门店实报' };
    });
    return { items, total_self_pay: total, currency: 'CNY' };
  }
}

/** 部位 + 维修方式 模糊匹配价格表 */
function matchPrice(catalog: PriceItem[], part: string, repair: string): PriceItem | null {
  // 1) 部位 + 维修方式 都命中
  for (const it of catalog) {
    if (part && it.part.includes(part) && repair && (it.repair.includes(repair) || repair.includes(it.repair))) {
      return it;
    }
  }
  // 2) 仅部位命中
  for (const it of catalog) {
    if (part && it.part.includes(part)) return it;
  }
  // 3) 仅维修方式命中
  for (const it of catalog) {
    if (repair && (it.repair.includes(repair) || repair.includes(it.repair))) return it;
  }
  return null;
}

import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class AdminService {
  constructor(private prisma: PrismaService) {}

  async getDashboard() {
    const [totalUsers, totalPolicies, totalClaims, activeClaims, totalShops, pendingReview] = await Promise.all([
      this.prisma.user.count(),
      this.prisma.policy.count(),
      this.prisma.claim.count(),
      this.prisma.claim.count({ where: { status: { in: ['REPAIRING', 'AWAITING_PAYMENT'] } } }),
      this.prisma.repairShop.count(),
      this.prisma.claim.count({ where: { status: 'SUBMITTED' } }),
    ]);

    const statusBreakdown = await this.prisma.claim.groupBy({
      by: ['status'],
      _count: true,
    });

    return {
      totalUsers,
      totalPolicies,
      totalClaims,
      activeClaims,
      totalShops,
      pendingReview,
      statusBreakdown: statusBreakdown.reduce((acc, item) => {
        acc[item.status] = item._count;
        return acc;
      }, {} as Record<string, number>),
    };
  }

  async getAllClaims(status?: string, page = 1, pageSize = 20) {
    const where: any = {};
    if (status) where.status = status;
    const [items, total] = await Promise.all([
      this.prisma.claim.findMany({
        where,
        include: {
          policy: { include: { vehicle: true } },
          owner: { select: { name: true, phone: true } },
          shop: { select: { name: true } },
        },
        orderBy: { id: 'desc' },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      this.prisma.claim.count({ where }),
    ]);
    return { items, total, page, pageSize };
  }

  async getClaimDetail(id: number) {
    const claim = await this.prisma.claim.findUnique({
      where: { id },
      include: {
        images: true,
        policy: { include: { vehicle: true, owner: { select: { name: true, phone: true } } } },
        damageReport: true,
        shop: true,
      },
    });
    if (!claim) throw new NotFoundException('理赔记录不存在');
    return claim;
  }

  async getUsers(page = 1, pageSize = 20) {
    const [items, total] = await Promise.all([
      this.prisma.user.findMany({
        orderBy: { id: 'desc' },
        skip: (page - 1) * pageSize,
        take: pageSize,
        select: { id: true, phone: true, name: true, role: true, createdAt: true },
      }),
      this.prisma.user.count(),
    ]);
    return { items, total, page, pageSize };
  }

  async getShops() {
    return this.prisma.repairShop.findMany({ orderBy: { rating: 'desc' } });
  }
}

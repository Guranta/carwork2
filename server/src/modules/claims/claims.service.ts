import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { DamageAiService } from '../damage-ai/damage-ai.service';
import { CreateClaimDto, UpdateClaimStatusDto } from './dto/claim.dto';
import { ClaimStatus } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';

const VALID_TRANSITIONS: Record<string, string[]> = {
  DRAFT: ['SUBMITTED'],
  SUBMITTED: ['UNDER_REVIEW'],
  UNDER_REVIEW: ['ASSESSED', 'REJECTED'],
  ASSESSED: ['REPAIRING'],
  REJECTED: [],
  REPAIRING: ['AWAITING_PAYMENT'],
  AWAITING_PAYMENT: ['CLOSED'],
  CLOSED: [],
};

@Injectable()
export class ClaimsService {
  constructor(
    private prisma: PrismaService,
    private damageAi: DamageAiService,
  ) {}

  async create(userId: number, dto: CreateClaimDto) {
    const policy = await this.prisma.policy.findUnique({ where: { id: dto.policyId } });
    if (!policy || policy.ownerId !== userId) throw new BadRequestException('保单不存在或不属于当前用户');
    if (policy.status !== 'ACTIVE') throw new BadRequestException('保单未生效');

    const claimNo = `CLM${Date.now()}`;
    return this.prisma.claim.create({
      data: {
        claimNo,
        policyId: dto.policyId,
        ownerId: userId,
        description: dto.description,
        incidentLat: dto.lat,
        incidentLng: dto.lng,
        status: 'DRAFT',
      },
    });
  }

  async findByUser(userId: number, status?: string) {
    const where: any = { ownerId: userId };
    if (status) where.status = status;
    return this.prisma.claim.findMany({
      where,
      include: { images: true, policy: { include: { vehicle: true } } },
      orderBy: { id: 'desc' },
    });
  }

  async findById(id: number) {
    const claim = await this.prisma.claim.findUnique({
      where: { id },
      include: {
        images: true,
        policy: { include: { vehicle: true, owner: { select: { id: true, name: true, phone: true } } } },
        damageReport: true,
        shop: true,
      },
    });
    if (!claim) throw new NotFoundException('理赔记录不存在');
    return claim;
  }

  async uploadImages(claimId: number, files: Express.Multer.File[]) {
    const claim = await this.prisma.claim.findUnique({ where: { id: claimId } });
    if (!claim) throw new NotFoundException('理赔记录不存在');

    const uploadDir = path.join(process.cwd(), 'uploads', String(claimId));
    if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

    const imageRecords = await Promise.all(
      files.map(async (file, idx) => {
        const filename = `${Date.now()}_${idx}${path.extname(file.originalname)}`;
        const filepath = path.join(uploadDir, filename);
        fs.writeFileSync(filepath, file.buffer);

        return this.prisma.claimImage.create({
          data: {
            claimId,
            url: `/uploads/${claimId}/${filename}`,
          },
        });
      }),
    );

    if (imageRecords.length > 0 && claim.status === 'DRAFT') {
      const filepath = path.join(uploadDir, `${Date.now()}_0${path.extname(files[0].originalname)}`);
      const damageResult = await this.damageAi.analyze(filepath);

      await this.prisma.damageReport.upsert({
        where: { claimId },
        create: {
          claimId,
          parts: damageResult.parts.join(', '),
          totalEstimate: damageResult.estimatedCost,
          aiRawResponse: JSON.stringify(damageResult),
        },
        update: {
          parts: damageResult.parts.join(', '),
          totalEstimate: damageResult.estimatedCost,
          aiRawResponse: JSON.stringify(damageResult),
        },
      });

      await this.prisma.claim.update({
        where: { id: claimId },
        data: { status: 'SUBMITTED' as ClaimStatus },
      });
    }

    return imageRecords;
  }

  async updateStatus(id: number, dto: UpdateClaimStatusDto) {
    const claim = await this.prisma.claim.findUnique({ where: { id } });
    if (!claim) throw new NotFoundException('理赔记录不存在');

    const allowed = VALID_TRANSITIONS[claim.status] || [];
    if (!allowed.includes(dto.status)) throw new BadRequestException(`不允许从 ${claim.status} 变更为 ${dto.status}`);

    const data: any = { status: dto.status as ClaimStatus };
    if (dto.shopId) data.shopId = dto.shopId;
    if (dto.assessmentAmount) data.assessmentAmount = dto.assessmentAmount;

    return this.prisma.claim.update({ where: { id }, data });
  }
}

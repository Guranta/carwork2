import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { PolicyStatus } from '@prisma/client';

@Injectable()
export class PoliciesService {
  constructor(private prisma: PrismaService) {}

  async findByOwner(ownerId: number, status?: PolicyStatus) {
    const where: any = { ownerId };
    if (status) where.status = status;
    return this.prisma.policy.findMany({
      where,
      include: { vehicle: true },
      orderBy: { id: 'desc' },
    });
  }

  async findById(id: number) {
    const policy = await this.prisma.policy.findUnique({
      where: { id },
      include: { vehicle: true, owner: { select: { id: true, name: true, phone: true } } },
    });
    if (!policy) throw new NotFoundException('保单不存在');
    return policy;
  }
}

import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findById(id: number) {
    return this.prisma.user.findUnique({
      where: { id },
      select: { id: true, phone: true, name: true, avatar: true, role: true, createdAt: true },
    });
  }

  async update(id: number, data: { name?: string; avatar?: string }) {
    return this.prisma.user.update({
      where: { id },
      data,
      select: { id: true, phone: true, name: true, avatar: true, role: true },
    });
  }

  async getVehicles(ownerId: number) {
    return this.prisma.vehicle.findMany({
      where: { ownerId },
      orderBy: { id: 'desc' },
    });
  }
}

import { Injectable, Logger, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { NotificationsService } from '../notifications/notifications.service';

@Injectable()
export class PaymentsService {
  private readonly logger = new Logger(PaymentsService.name);

  constructor(
    private prisma: PrismaService,
    private notifications: NotificationsService,
  ) {}

  async createOrder(claimId: number, userId: number, amount: number, type: 'ADVANCE' | 'SELF') {
    const claim = await this.prisma.claim.findUnique({ where: { id: claimId }, include: { policy: true } });
    if (!claim) throw new NotFoundException('理赔记录不存在');
    if (claim.policy.ownerId !== userId) throw new BadRequestException('无权操作');
    if (claim.status !== 'AWAITING_PAYMENT') throw new BadRequestException('当前状态不支持支付');

    const existing = await this.prisma.payment.findFirst({
      where: { claimId, status: 'SUCCESS' },
    });
    if (existing) throw new BadRequestException('已支付，请勿重复支付');

    const order = await this.prisma.payment.create({
      data: {
        claimId,
        mockOrderNo: `PAY${Date.now()}${Math.floor(Math.random() * 1000)}`,
        amount,
        type,
      },
    });

    return order;
  }

  async mockPay(orderId: number, userId: number) {
    const payment = await this.prisma.payment.findUnique({
      where: { id: orderId },
      include: { claim: { include: { policy: true } } },
    });
    if (!payment) throw new NotFoundException('支付订单不存在');
    if (payment.claim.policy.ownerId !== userId) throw new BadRequestException('无权操作');
    if (payment.status === 'SUCCESS') throw new BadRequestException('已支付');

    await new Promise((resolve) => setTimeout(resolve, 1000));

    const updated = await this.prisma.payment.update({
      where: { id: orderId },
      data: { status: 'SUCCESS', paidAt: new Date() },
    });

    await this.prisma.claim.update({
      where: { id: payment.claimId },
      data: { status: 'CLOSED' },
    });

    await this.notifications.send(
      userId,
      'PAYMENT',
      '支付成功',
      `您的理赔 ${payment.claim.claimNo} 支付成功，金额 ¥${payment.amount}`,
    );

    this.logger.log(`Payment ${orderId} completed`);
    return updated;
  }

  async findByClaim(claimId: number) {
    return this.prisma.payment.findMany({ where: { claimId }, orderBy: { id: 'desc' } });
  }
}

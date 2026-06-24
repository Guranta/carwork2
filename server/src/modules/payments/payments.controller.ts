import { Controller, Get, Post, Param, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { PaymentsService } from './payments.service';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('Payments')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post('create')
  @ApiOperation({ summary: '创建支付订单' })
  create(
    @CurrentUser() user: any,
    @Body() body: { claimId: number; amount: number; type: 'ADVANCE' | 'SELF' },
  ) {
    return this.paymentsService.createOrder(body.claimId, user.id, body.amount, body.type);
  }

  @Post(':id/pay')
  @ApiOperation({ summary: 'Mock 支付' })
  pay(@CurrentUser() user: any, @Param('id') id: string) {
    return this.paymentsService.mockPay(Number(id), user.id);
  }

  @Get('claim/:claimId')
  @ApiOperation({ summary: '获取理赔的支付记录' })
  byClaim(@Param('claimId') claimId: string) {
    return this.paymentsService.findByClaim(Number(claimId));
  }
}

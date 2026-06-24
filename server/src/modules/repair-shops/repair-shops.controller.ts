import { Controller, Get, Param, Post, Body, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { RepairShopsService } from './repair-shops.service';
import { NearbyQueryDto, CreateReviewDto } from './dto/repair-shop.dto';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('RepairShops')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('repair-shops')
export class RepairShopsController {
  constructor(private readonly repairShopsService: RepairShopsService) {}

  @Get('nearby')
  @ApiOperation({ summary: '获取附近修理厂' })
  nearby(@Query() query: NearbyQueryDto) {
    return this.repairShopsService.findNearby(query);
  }

  @Get(':id')
  @ApiOperation({ summary: '修理厂详情' })
  detail(@Param('id') id: string) {
    return this.repairShopsService.findById(Number(id));
  }

  @Get(':id/reviews')
  @ApiOperation({ summary: '修理厂评价列表' })
  reviews(@Param('id') id: string) {
    return this.repairShopsService.getShopReviews(Number(id));
  }

  @Post('reviews')
  @ApiOperation({ summary: '提交评价' })
  createReview(@CurrentUser() user: any, @Body() dto: CreateReviewDto) {
    return this.repairShopsService.createReview(user.id, dto);
  }
}

import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { MapService } from '../map/map.service';
import { NearbyQueryDto, CreateReviewDto } from './dto/repair-shop.dto';

@Injectable()
export class RepairShopsService {
  constructor(
    private prisma: PrismaService,
    private mapService: MapService,
  ) {}

  async findNearby(query: NearbyQueryDto) {
    const { lat, lng, radius = 10, sort = 'distance' } = query;

    const shops = await this.prisma.repairShop.findMany();

    const result = shops
      .map((shop) => {
        const distance = this.mapService.calculateDistance(lat, lng, shop.lat, shop.lng);
        return { ...shop, distance, distanceText: this.mapService.formatDistance(distance) };
      })
      .filter((shop) => shop.distance <= radius)
      .sort((a, b) => {
        if (sort === 'rating') return b.rating - a.rating;
        if (sort === 'price') return a.basePrice - b.basePrice;
        return a.distance - b.distance;
      });

    return result;
  }

  async findById(id: number) {
    const shop = await this.prisma.repairShop.findUnique({
      where: { id },
      include: { reviews: { include: { owner: { select: { name: true } } } } },
    });
    if (!shop) throw new NotFoundException('修理厂不存在');
    return shop;
  }

  async createReview(userId: number, dto: CreateReviewDto) {
    const claim = await this.prisma.claim.findUnique({
      where: { id: dto.claimId },
      include: { shop: true },
    });
    if (!claim) throw new NotFoundException('理赔记录不存在');
    if (!claim.shopId) throw new Error('该理赔未指定修理厂');

    const review = await this.prisma.review.create({
      data: {
        claimId: dto.claimId,
        shopId: claim.shopId,
        ownerId: userId,
        rating: dto.rating,
        comment: dto.comment || '',
      },
    });

    const reviews = await this.prisma.review.findMany({ where: { shopId: claim.shopId } });
    const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
    await this.prisma.repairShop.update({
      where: { id: claim.shopId },
      data: { rating: Math.round(avgRating * 10) / 10, reviewCount: reviews.length },
    });

    return review;
  }

  async getShopReviews(shopId: number) {
    return this.prisma.review.findMany({
      where: { shopId },
      include: { owner: { select: { name: true } } },
      orderBy: { id: 'desc' },
    });
  }
}

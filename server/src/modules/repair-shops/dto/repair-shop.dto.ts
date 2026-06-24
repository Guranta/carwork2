import { IsNumber, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class NearbyQueryDto {
  @ApiProperty({ description: '纬度' })
  @IsNumber()
  @Type(() => Number)
  lat: number;

  @ApiProperty({ description: '经度' })
  @IsNumber()
  @Type(() => Number)
  lng: number;

  @ApiPropertyOptional({ description: '搜索半径(km)', default: 10 })
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  radius?: number;

  @ApiPropertyOptional({ description: '排序方式: distance|rating|price' })
  @IsString()
  @IsOptional()
  sort?: string;
}

export class CreateReviewDto {
  @ApiProperty({ description: '理赔ID' })
  @IsNumber()
  claimId: number;

  @ApiProperty({ description: '评分 1-5' })
  @IsNumber()
  rating: number;

  @ApiPropertyOptional({ description: '评价内容' })
  @IsString()
  @IsOptional()
  comment?: string;
}

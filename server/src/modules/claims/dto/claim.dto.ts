import { IsString, IsNumber, IsOptional, IsEnum, IsNotEmpty } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateClaimDto {
  @ApiProperty({ description: '保单ID' })
  @IsNumber()
  policyId: number;

  @ApiProperty({ description: '事故描述' })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiPropertyOptional({ description: '纬度' })
  @IsNumber()
  @IsOptional()
  lat?: number;

  @ApiPropertyOptional({ description: '经度' })
  @IsNumber()
  @IsOptional()
  lng?: number;

  @ApiPropertyOptional({ description: '事故地址' })
  @IsString()
  @IsOptional()
  address?: string;
}

export class UpdateClaimStatusDto {
  @ApiProperty({ description: '新状态', enum: ['SUBMITTED', 'UNDER_REVIEW', 'ASSESSED', 'REPAIRING', 'AWAITING_PAYMENT', 'CLOSED', 'REJECTED'] })
  @IsString()
  status: string;

  @ApiPropertyOptional({ description: '备注' })
  @IsString()
  @IsOptional()
  remark?: string;

  @ApiPropertyOptional({ description: '修理厂ID' })
  @IsNumber()
  @IsOptional()
  shopId?: number;

  @ApiPropertyOptional({ description: '定损金额' })
  @IsNumber()
  @IsOptional()
  assessmentAmount?: number;
}

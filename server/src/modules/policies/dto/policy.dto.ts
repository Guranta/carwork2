import { IsOptional, IsString, IsEnum } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { PolicyStatus } from '@prisma/client';

export class QueryPolicyDto {
  @ApiPropertyOptional({ enum: PolicyStatus, description: '保单状态' })
  @IsOptional()
  @IsEnum(PolicyStatus)
  status?: PolicyStatus;
}

export class PolicyParamDto {
  @ApiProperty({ description: '保单ID' })
  @IsString()
  id: string;
}

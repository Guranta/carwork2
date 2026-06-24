import { IsString, IsNotEmpty, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateUserDto {
  @ApiPropertyOptional({ description: '昵称' })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiPropertyOptional({ description: '头像URL' })
  @IsString()
  @IsOptional()
  avatar?: string;
}

export class QueryUserDto {
  @ApiProperty({ description: '手机号' })
  @IsString()
  @IsNotEmpty()
  phone: string;
}

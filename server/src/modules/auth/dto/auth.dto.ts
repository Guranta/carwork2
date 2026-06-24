import { IsString, IsNotEmpty, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SendCodeDto {
  @ApiProperty({ example: '13800000001', description: '手机号' })
  @IsString()
  @IsNotEmpty()
  @Length(11, 11)
  phone: string;
}

export class VerifyCodeDto {
  @ApiProperty({ example: '13800000001', description: '手机号' })
  @IsString()
  @IsNotEmpty()
  @Length(11, 11)
  phone: string;

  @ApiProperty({ example: '1234', description: '验证码' })
  @IsString()
  @IsNotEmpty()
  @Length(4, 6)
  code: string;
}

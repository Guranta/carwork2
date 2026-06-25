import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsOptional, IsString } from 'class-validator';

export class AgentMessageDto {
  @ApiProperty({ example: 'user' })
  role!: string;

  @ApiProperty({ example: '我车牌京A12345，能赔本车损伤吗' })
  content!: string;
}

export class AgentChatInDto {
  @ApiProperty({ type: [AgentMessageDto], description: '最近对话历史，最后一条通常是本轮用户输入' })
  @IsArray()
  messages!: AgentMessageDto[];

  @ApiPropertyOptional({ description: '角色轻调: customer / agent / service' })
  @IsOptional()
  @IsString()
  role?: string;

  @ApiPropertyOptional({
    type: [String],
    description: '本轮上传的车损图片(data URI)，前端压缩成 base64 生成',
  })
  @IsOptional()
  @IsArray()
  images?: string[];
}

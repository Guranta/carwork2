import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { AgentService } from './agent.service';
import { AgentChatInDto } from './agent.dto';

@ApiTags('Agent')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('agent')
export class AgentController {
  constructor(private readonly agentService: AgentService) {}

  @Post('chat')
  @ApiOperation({ summary: 'Agent 对话：多轮 + function calling + 可带车损图片' })
  chat(@Body() dto: AgentChatInDto) {
    return this.agentService.chat(dto.messages, dto.images || [], dto.role || 'customer');
  }
}

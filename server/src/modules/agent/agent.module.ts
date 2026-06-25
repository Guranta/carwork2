import { Module } from '@nestjs/common';
import { AgentController } from './agent.controller';
import { AgentService } from './agent.service';
import { AgentToolsService } from './agent.tools';
import { MapModule } from '../map/map.module';

@Module({
  imports: [MapModule],
  controllers: [AgentController],
  providers: [AgentService, AgentToolsService],
})
export class AgentModule {}

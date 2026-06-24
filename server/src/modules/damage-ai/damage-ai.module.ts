import { Module } from '@nestjs/common';
import { DamageAiService } from './damage-ai.service';

@Module({ providers: [DamageAiService], exports: [DamageAiService] })
export class DamageAiModule {}

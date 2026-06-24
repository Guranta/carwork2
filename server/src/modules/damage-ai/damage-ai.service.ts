import { Injectable } from '@nestjs/common';

export interface DamageResult {
  parts: string[];
  severity: 'MINOR' | 'MODERATE' | 'SEVERE';
  estimatedCost: number;
}

@Injectable()
export class DamageAiService {
  async analyze(imagePath: string): Promise<DamageResult> {
    console.log(`[DamageAI Mock] Analyzing ${imagePath}`);
    return {
      parts: ['前保险杠', '左前大灯'],
      severity: 'MODERATE',
      estimatedCost: 3500,
    };
  }
}

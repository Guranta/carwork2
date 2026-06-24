import { Injectable } from '@nestjs/common';

@Injectable()
export class OcrService {
  async recognizePlate(imagePath: string): Promise<string | null> {
    console.log(`[OCR Mock] Recognizing plate from ${imagePath}`);
    return '京A12345';
  }
}

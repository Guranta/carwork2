import { Injectable } from '@nestjs/common';

@Injectable()
export class SmsService {
  private readonly MOCK_CODE = '1234';

  async sendCode(phone: string): Promise<void> {
    console.log(`[SMS Mock] Sending code ${this.MOCK_CODE} to ${phone}`);
  }

  async verifyCode(phone: string, code: string): Promise<boolean> {
    return code === this.MOCK_CODE;
  }
}

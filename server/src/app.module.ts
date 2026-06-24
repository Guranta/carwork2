import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { HealthModule } from './modules/health/health.module';
import { SmsModule } from './modules/sms/sms.module';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { PoliciesModule } from './modules/policies/policies.module';
import { ClaimsModule } from './modules/claims/claims.module';
import { UploadModule } from './modules/upload/upload.module';
import { OcrModule } from './modules/ocr/ocr.module';
import { DamageAiModule } from './modules/damage-ai/damage-ai.module';
import { RepairShopsModule } from './modules/repair-shops/repair-shops.module';
import { AdminModule } from './modules/admin/admin.module';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { PaymentsModule } from './modules/payments/payments.module';

@Module({
  imports: [
    PrismaModule,
    HealthModule,
    SmsModule,
    AuthModule,
    UsersModule,
    PoliciesModule,
    ClaimsModule,
    UploadModule,
    OcrModule,
    DamageAiModule,
    RepairShopsModule,
    AdminModule,
    NotificationsModule,
    PaymentsModule,
  ],
})
export class AppModule {}

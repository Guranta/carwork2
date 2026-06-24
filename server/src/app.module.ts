import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { HealthModule } from './modules/health/health.module';
import { SmsModule } from './modules/sms/sms.module';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { PoliciesModule } from './modules/policies/policies.module';

@Module({
  imports: [PrismaModule, HealthModule, SmsModule, AuthModule, UsersModule, PoliciesModule],
})
export class AppModule {}

import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../prisma/prisma.service';
import { SmsService } from '../sms/sms.service';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private sms: SmsService,
  ) {}

  async sendCode(phone: string) {
    await this.sms.sendCode(phone);
    return { message: '验证码已发送' };
  }

  async login(phone: string, code: string) {
    const valid = await this.sms.verifyCode(phone, code);
    if (!valid) throw new UnauthorizedException('验证码错误');

    let user = await this.prisma.user.findUnique({ where: { phone } });
    if (!user) {
      user = await this.prisma.user.create({
        data: { phone, name: `用户${phone.slice(-4)}`, role: 'OWNER' },
      });
    }

    const token = this.signToken(user.id, 'OWNER');
    return { token, user };
  }

  async adminLogin(username: string, password: string) {
    const admin = await this.prisma.admin.findUnique({ where: { username } });
    if (!admin) throw new UnauthorizedException('账号或密码错误');

    const match = await bcrypt.compare(password, admin.passwordHash);
    if (!match) throw new UnauthorizedException('账号或密码错误');

    const token = this.signToken(admin.id, admin.role, true);
    return {
      token,
      admin: { id: admin.id, username: admin.username, name: admin.name, role: admin.role },
    };
  }

  private signToken(id: number, role: string, isAdmin = false) {
    return this.jwt.sign({ sub: id, role, isAdmin });
  }
}

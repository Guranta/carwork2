import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private prisma: PrismaService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'change-me-in-production',
    });
  }

  async validate(payload: { sub: number; role: string; isAdmin: boolean }) {
    if (payload.isAdmin) {
      const admin = await this.prisma.admin.findUnique({ where: { id: payload.sub } });
      if (!admin) throw new UnauthorizedException();
      return { id: admin.id, role: admin.role, isAdmin: true, name: admin.name };
    }
    const user = await this.prisma.user.findUnique({ where: { id: payload.sub } });
    if (!user) throw new UnauthorizedException();
    return { id: user.id, role: user.role, isAdmin: false, name: user.name, phone: user.phone };
  }
}

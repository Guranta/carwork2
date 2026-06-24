import { Controller, Post, Body } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { SendCodeDto, VerifyCodeDto } from './dto/auth.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('send-code')
  @ApiOperation({ summary: '发送验证码' })
  sendCode(@Body() dto: SendCodeDto) {
    return this.authService.sendCode(dto.phone);
  }

  @Post('login')
  @ApiOperation({ summary: '手机号验证码登录' })
  login(@Body() dto: VerifyCodeDto) {
    return this.authService.login(dto.phone, dto.code);
  }

  @Post('admin-login')
  @ApiOperation({ summary: '管理员账号密码登录' })
  adminLogin(@Body() dto: { username: string; password: string }) {
    return this.authService.adminLogin(dto.username, dto.password);
  }
}

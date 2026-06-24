import { Controller, Get, Patch, Body, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/user.dto';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('Users')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  @ApiOperation({ summary: '获取当前用户信息' })
  getMe(@CurrentUser() user: any) {
    return this.usersService.findById(user.id);
  }

  @Patch('me')
  @ApiOperation({ summary: '更新当前用户信息' })
  updateMe(@CurrentUser() user: any, @Body() dto: UpdateUserDto) {
    return this.usersService.update(user.id, dto);
  }

  @Get('vehicles')
  @ApiOperation({ summary: '获取我的车辆列表' })
  getMyVehicles(@CurrentUser() user: any) {
    return this.usersService.getVehicles(user.id);
  }
}

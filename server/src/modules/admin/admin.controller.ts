import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { AdminGuard } from '../../common/guards/admin.guard';
import { AdminService } from './admin.service';

@ApiTags('Admin')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'), AdminGuard)
@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('dashboard')
  @ApiOperation({ summary: 'Dashboard 数据' })
  dashboard() {
    return this.adminService.getDashboard();
  }

  @Get('claims')
  @ApiOperation({ summary: '获取所有理赔列表(管理员)' })
  claims(@Query('status') status?: string, @Query('page') page?: string, @Query('pageSize') pageSize?: string) {
    return this.adminService.getAllClaims(status, Number(page) || 1, Number(pageSize) || 20);
  }

  @Get('claims/:id')
  @ApiOperation({ summary: '理赔详情(管理员)' })
  claimDetail(id: string) {
    return this.adminService.getClaimDetail(Number(id));
  }

  @Get('users')
  @ApiOperation({ summary: '用户列表' })
  users(@Query('page') page?: string, @Query('pageSize') pageSize?: string) {
    return this.adminService.getUsers(Number(page) || 1, Number(pageSize) || 20);
  }

  @Get('shops')
  @ApiOperation({ summary: '修理厂列表' })
  shops() {
    return this.adminService.getShops();
  }
}

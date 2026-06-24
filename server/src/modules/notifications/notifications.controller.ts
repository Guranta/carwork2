import { Controller, Get, Patch, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { NotificationsService } from './notifications.service';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('Notifications')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Get()
  @ApiOperation({ summary: '获取通知列表' })
  list(@CurrentUser() user: any, @Query('unreadOnly') unreadOnly?: string) {
    return this.notificationsService.findByUser(user.id, unreadOnly === 'true');
  }

  @Get('unread-count')
  @ApiOperation({ summary: '未读数' })
  unreadCount(@CurrentUser() user: any) {
    return this.notificationsService.getUnreadCount(user.id);
  }

  @Patch(':id/read')
  @ApiOperation({ summary: '标记已读' })
  markRead(@Param('id') id: string) {
    return this.notificationsService.markAsRead(Number(id));
  }

  @Patch('read-all')
  @ApiOperation({ summary: '全部已读' })
  markAllRead(@CurrentUser() user: any) {
    return this.notificationsService.markAllAsRead(user.id);
  }
}

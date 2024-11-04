import { Body, Get, Post, Query } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { CommonController } from '@repo/decorator';
import { CurrentUser } from '../../../authentication/infrastructure/web/decorators';
import { DoneResponse } from '@repo/types/serialization';
import { NotificationsService } from '../../application/notifications.service';
import { AddPushTokenDto } from './add-push-token.dto';
import { FilterNotificationDto } from './filter-notification.dto';
import { FindOneNotificationDto } from './find-one-notification.dto';
import { NotificationListResponse } from './notification-list.response';
import { NotificationUnreadCountResponse } from './notification-unread-count.response';

@CommonController('/notifications')
@ApiTags('Notifications')
export class NotificationController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Post('read')
  @ApiOkResponse({
    status: 200,
    type: DoneResponse,
  })
  async markNotificationAsRead(
    @Body() { id }: FindOneNotificationDto,
    @CurrentUser() user: CurrentUser,
  ): Promise<DoneResponse> {
    await this.notificationsService.markNotificationAsRead(id, user.id);
    return new DoneResponse();
  }

  @Post('read-all')
  @ApiOkResponse({
    status: 200,
    type: DoneResponse,
  })
  async markAllNotificationsAsRead(@CurrentUser() user: CurrentUser): Promise<DoneResponse> {
    await this.notificationsService.markAllNotificationsAsRead(user.id);
    return new DoneResponse();
  }

  @Get('unread-count')
  @ApiOkResponse({
    status: 200,
    type: NotificationUnreadCountResponse,
  })
  async findNotificationUnreadCount(@CurrentUser() user: CurrentUser): Promise<NotificationUnreadCountResponse> {
    const count = await this.notificationsService.getNotificationUnreadCount(user.id);
    return NotificationUnreadCountResponse.from(count);
  }

  @Get()
  @ApiOkResponse({
    status: 200,
    type: NotificationListResponse,
  })
  async findAll(
    @Query() filtersDto: FilterNotificationDto,
    @CurrentUser() user: CurrentUser,
  ): Promise<NotificationListResponse> {
    const result = await this.notificationsService.findAll({
      page: filtersDto.page,
      pageSize: filtersDto.pageSize,
      orderBy: filtersDto.orderBy,
      orderDir: filtersDto.orderDir,
      userIds: [user.id],
      showInNotificationCenter: true,
    });

    return NotificationListResponse.from(result, filtersDto);
  }

  @Post('tokens')
  @ApiOkResponse({
    status: 200,
    type: DoneResponse,
  })
  async addPushToken(@Body() { token }: AddPushTokenDto, @CurrentUser() user: CurrentUser): Promise<DoneResponse> {
    await this.notificationsService.addPushToken(token, user.id);
    return new DoneResponse();
  }
}

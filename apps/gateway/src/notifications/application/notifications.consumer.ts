import { Injectable } from '@nestjs/common';
import { OnRabbitEvent } from '@repo/rabbit/decorators';
import { NotificationEvents } from '../domain/events';
import { NOTIFICATION_EXCHANGE_NAME } from '../infrastructure/constants';
import { CreateNotificationData, NotificationsService } from './notifications.service';

@Injectable()
export class NotificationsConsumer {
  constructor(private readonly notificationsService: NotificationsService) {}

  @OnRabbitEvent({
    exchange: NOTIFICATION_EXCHANGE_NAME,
    routingKey: NotificationEvents.NOTIFICATION_CREATED,
    queue: 'notifications_created_notification',
  })
  async createNotification(input: CreateNotificationData): Promise<void> {
    await this.notificationsService.consumeEvent(input);
  }
}

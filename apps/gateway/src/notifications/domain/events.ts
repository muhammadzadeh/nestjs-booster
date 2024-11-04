import { CreateNotificationData } from '../application/notifications.service';

export enum NotificationEvents {
  NOTIFICATION_CREATED = 'notification.created',
}

export class NotificationCreatedEvent extends CreateNotificationData {}

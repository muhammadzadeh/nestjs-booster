import { Paginated } from '@repo/types/database';
import { NotificationPushTokenEntity, PushProvider } from '../entities/notification-push-token.entity';

export interface FindNotificationData {
  userIds: string[];
  providers: PushProvider[];
}

export const NOTIFICATION_PUSH_TOKEN_REPOSITORY_TOKEN = Symbol('NotificationPushTokensRepository');

export interface NotificationPushTokensRepository {
  save(data: NotificationPushTokenEntity): Promise<void>;
  findAll(options: Partial<FindNotificationData>): Promise<Paginated<NotificationPushTokenEntity>>;
}

import { Paginated, PaginationOption } from '@repo/types/database';
import { AlertStatus, NotificationEntity, NotificationStatus } from '../entities/notification.entity';

export interface FindNotificationData {
  ids: string[];
  statuses: NotificationStatus[];
  userIds: string[];
  showAsAlert: boolean;
  alertStatuses: AlertStatus[];
  showInNotificationCenter: boolean;
}

export type FindPaginatedNotificationData = Partial<FindNotificationData> &  PaginationOption<NotificationOrderBy>

export enum NotificationOrderBy {
  CREATED_AT = 'created_at',
  UPDATED_AT = 'updated_at',
}

export const NOTIFICATION_REPOSITORY_TOKEN = Symbol('NotificationsRepository');

export interface NotificationsRepository {
  save(data: NotificationEntity): Promise<NotificationEntity>;
  update(options: Partial<FindNotificationData>, data: Partial<NotificationEntity>): Promise<void>
  findOne(options: Partial<FindNotificationData>): Promise<NotificationEntity | null>;
  exists(options: Partial<FindNotificationData>): Promise<boolean>;
  findAll(options: FindPaginatedNotificationData): Promise<Paginated<NotificationEntity>>;
  count(options: Partial<FindNotificationData>): Promise<number>;
}

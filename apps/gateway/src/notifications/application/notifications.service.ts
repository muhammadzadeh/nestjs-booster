import { HttpStatus, Inject, Injectable } from '@nestjs/common';
import { BaseHttpException } from '@repo/exception/base.exception';
import { Paginated } from '@repo/types/database';
import { ErrorCode } from '@repo/types/error-code.enum';
import { NotificationPushTokenEntity, PushProvider } from '../domain/entities/notification-push-token.entity';
import {
  AlertStatus,
  EmailNotificationPayload,
  NotificationCenterData,
  NotificationEntity,
  NotificationEvent,
  NotificationGroupType,
  NotificationPriority,
  NotificationStatus,
  PushNotificationPayload,
  SmsNotificationPayload,
} from '../domain/entities/notification.entity';
import {
  NOTIFICATION_PUSH_TOKEN_REPOSITORY_TOKEN,
  NotificationPushTokensRepository,
} from '../domain/repositories/notification-push-tokens.repository';
import {
  FindPaginatedNotificationData,
  NOTIFICATION_REPOSITORY_TOKEN,
  NotificationsRepository,
} from '../domain/repositories/notifications.repository';
import { NotificationsDispatcher } from './notifications.dispatcher';

@Injectable()
export class NotificationsService {
  constructor(
    @Inject(NOTIFICATION_PUSH_TOKEN_REPOSITORY_TOKEN)
    private readonly tokensRepository: NotificationPushTokensRepository,
    @Inject(NOTIFICATION_REPOSITORY_TOKEN) private readonly notificationsRepository: NotificationsRepository,
    private readonly notificationDispatcher: NotificationsDispatcher,
  ) {}

  async create(input: CreateNotificationData): Promise<NotificationEntity> {
    const createdNotification = new NotificationEntity(input.event, input.showAsAlert, input.groupType, input.priority);

    if (input.userId) {
      createdNotification.setUserId(input.userId);
    }

    if (input.emailData) {
      createdNotification.setEmailData(input.emailData);
    }

    if (input.pushData) {
      createdNotification.setPushData(input.pushData);
    }

    if (input.smsData) {
      createdNotification.setSmsData(input.smsData);
    }

    if (input.notificationCenterData) {
      createdNotification.setNotificationCenterData(input.notificationCenterData);
    }

    return await this.notificationsRepository.save(createdNotification);
  }

  async consumeEvent(input: CreateNotificationData): Promise<void> {
    const createdNotification = await this.create(input);
    await this.notificationDispatcher.dispatch(createdNotification);
  }

  async findAll(input: FindPaginatedNotificationData): Promise<Paginated<NotificationEntity>> {
    return await this.notificationsRepository.findAll(input);
  }

  async findOneOrFail(id: string): Promise<NotificationEntity> {
    const notificationRecord = await this.notificationsRepository.findOne({ ids: [id] });
    if (!notificationRecord) {
      throw new NotificationNotFoundException();
    }

    return notificationRecord;
  }

  async markNotificationAsRead(id: string, userId: string): Promise<void> {
    const notificationRecord = await this.findOneOrFail(id);
    if (notificationRecord.userId != userId) {
      throw new NotificationNotFoundException(`Can not mark as read, The ${userId} is not owner of notification ${id}`);
    }
    notificationRecord.markAsRead();
    await this.notificationsRepository.save(notificationRecord);
  }

  async markAllNotificationsAsRead(userId: string): Promise<void> {
    await this.notificationsRepository.update(
      {
        statuses: [NotificationStatus.NOT_READ],
        userIds: [userId],
      },
      {
        status: NotificationStatus.READ,
      },
    );
  }

  async getNotificationUnreadCount(userId: string): Promise<number> {
    return this.notificationsRepository.count({
      userIds: [userId],
      statuses: [NotificationStatus.NOT_READ],
    });
  }

  async addPushToken(token: string, userId: string): Promise<void> {
    await this.tokensRepository.save(new NotificationPushTokenEntity(userId, token, PushProvider.FCM));
  }

  async findAllAlerts(input: FindPaginatedNotificationData): Promise<Paginated<NotificationEntity>> {
    const result = await this.findAll({
      ...input,
      statuses: [NotificationStatus.NOT_READ],
      showAsAlert: true,
      alertStatuses: [AlertStatus.NOT_READ],
    });

    const notificationIds = result.items.map((notification) => notification.id);
    await this.markViewedAlertsAsSeen(notificationIds);

    return result;
  }

  private async markViewedAlertsAsSeen(ids: string[]): Promise<void> {
    if (!ids.length) {
      return;
    }

    await this.notificationsRepository.update(
      {
        ids: ids,
      },
      {
        alertStatus: AlertStatus.READ,
      },
    );
  }
}

export class CreateNotificationData {
  readonly event!: NotificationEvent;
  readonly userId?: string;
  readonly notificationCenterData?: NotificationCenterData;
  readonly showAsAlert?: boolean;
  readonly priority?: NotificationPriority;
  readonly groupType?: NotificationGroupType;
  readonly emailData?: EmailNotificationPayload;
  readonly pushData?: PushNotificationPayload;
  readonly smsData?: SmsNotificationPayload;
}

export class NotificationNotFoundException extends BaseHttpException {
  readonly status: HttpStatus = HttpStatus.NOT_FOUND;
  readonly useOriginalMessage?: boolean;
  readonly code: ErrorCode = ErrorCode.NOTIFICATION_NOT_FOUND;
}

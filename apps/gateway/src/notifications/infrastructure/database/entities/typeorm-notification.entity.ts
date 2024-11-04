import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';
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
} from '../../../domain/entities/notification.entity';

@Entity({ name: 'notifications' })
export class TypeormNotificationEntity {
  @PrimaryGeneratedColumn('uuid', { primaryKeyConstraintName: 'notifications_id_pkey' })
  readonly id!: string;

  @Column({ type: 'varchar' })
  readonly event!: NotificationEvent;

  @Column({ type: 'varchar', default: '1.0' })
  readonly version!: string;

  @Column({ type: 'uuid', name: 'user_id', nullable: true })
  @Index('notifications_user_id_idx')
  readonly userId!: string | null;

  @Column({ type: 'enum', enum: NotificationStatus, default: NotificationStatus.NOT_READ })
  @Index('notifications_status_idx')
  readonly status!: NotificationStatus;

  @Column({ type: 'enum', enum: NotificationGroupType, name: 'group_type' })
  readonly groupType!: NotificationGroupType;

  @Column({ type: 'enum', enum: NotificationPriority })
  readonly priority!: NotificationPriority;

  @Column({ type: 'enum', enum: AlertStatus, name: 'alert_status', default: AlertStatus.NONE })
  readonly alertStatus!: AlertStatus;

  @Column({ type: 'boolean', name: 'show_as_alert' })
  readonly showAsAlert!: boolean;

  @Column({ type: 'jsonb', name: 'notification_center_data', nullable: true })
  readonly notificationCenterData!: NotificationCenterData | null;

  @Column({ type: 'jsonb', nullable: true, name: 'email_data' })
  readonly emailData!: EmailNotificationPayload | null;

  @Column({ type: 'jsonb', nullable: true, name: 'push_data' })
  readonly pushData!: PushNotificationPayload | null;

  @Column({ type: 'jsonb', nullable: true, name: 'sms_data' })
  readonly smsData!: SmsNotificationPayload | null;

  @Column({ type: 'timestamptz', nullable: true, name: 'read_at' })
  readonly readAt!: Date | null;

  @Column({ type: 'timestamptz', name: 'created_at', default: 'now()' })
  readonly createdAt!: Date;

  @Column({ type: 'timestamptz', name: 'updated_at', default: 'now()' })
  readonly updatedAt!: Date;

  @Column({ type: 'timestamptz', nullable: true, name: 'deleted_at' })
  readonly deletedAt!: Date | null;

  static toNotificationEntity(input: TypeormNotificationEntity): NotificationEntity {
    return new NotificationEntity(
      input.event,
      input.showAsAlert,
      input.groupType,
      input.priority,
      input.userId,
      input.id,
      input.notificationCenterData,
      input.emailData,
      input.pushData,
      input.smsData,
      input.status,
      input.deletedAt,
      input.readAt,
      input.createdAt,
      input.updatedAt,
      input.version,
      input.alertStatus,
    );
  }
}

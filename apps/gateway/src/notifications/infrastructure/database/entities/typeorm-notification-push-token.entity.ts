import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { NotificationPushTokenEntity, PushProvider } from '../../../domain/entities/notification-push-token.entity';

@Entity({ name: 'notification_push_tokens' })
export class TypeormNotificationPushTokenEntity {
  @PrimaryGeneratedColumn('uuid', { primaryKeyConstraintName: 'notification_push_tokens_id_pkey' })
  readonly id!: string;

  @Column({ type: 'uuid', name: 'user_id' })
  readonly userId!: string;

  @Column({ type: 'varchar' })
  readonly token!: string;

  @Column({ type: 'enum', enum: PushProvider, default: PushProvider.FCM })
  readonly provider!: PushProvider;

  @Column({ type: 'timestamptz', name: 'created_at', default: 'now()' })
  readonly createdAt!: Date;

  @Column({ type: 'timestamptz', name: 'updated_at', default: 'now()' })
  readonly updatedAt!: Date;

  @Column({ type: 'timestamptz', nullable: true, name: 'deleted_at' })
  readonly deletedAt!: Date | null;

  static toNotificationPushTokenEntity(input: TypeormNotificationPushTokenEntity): NotificationPushTokenEntity {
    return new NotificationPushTokenEntity(
      input.userId,
      input.token,
      input.provider,
      input.id,
      input.deletedAt,
      input.createdAt,
      input.updatedAt,
    );
  }
}

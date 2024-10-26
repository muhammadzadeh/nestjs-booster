import { randomUUID } from 'crypto';
import { now } from '@repo/utils/time';

export class NotificationPushTokenEntity {
  constructor(userId: string, token: string, provider: PushProvider);
  constructor(
    userId: string,
    token: string,
    provider: PushProvider,
    id: string,
    deletedAt: Date | null,
    createdAt: Date,
    updatedAt: Date,
  );
  constructor(
    userId: string,
    token: string,
    provider: PushProvider,
    id?: string,
    deletedAt?: Date | null,
    createdAt?: Date,
    updatedAt?: Date,
  ) {
    this.id = id ?? randomUUID();
    this.token = token;
    this.userId = userId;
    this.provider = provider;
    this.deletedAt = deletedAt ?? null;
    this.createdAt = createdAt ?? now().toJSDate();
    this.updatedAt = updatedAt ?? now().toJSDate();
  }

  readonly id!: string;
  readonly token!: string;
  readonly userId!: string;
  readonly provider!: PushProvider;
  deletedAt!: Date | null;
  readonly createdAt!: Date;
  updatedAt!: Date;
}

export enum PushProvider {
  FCM = 'fcm',
  APN = 'apn',
}

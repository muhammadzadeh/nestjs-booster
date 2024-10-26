import { randomUUID } from 'crypto';
import { now } from '../../../../common/time';
import { UserId } from '@repo/types/common.types';
export class RoleEntity {
  constructor(title: string, permissions: Permission[]);
  constructor(
    title: string,
    permissions: Permission[],
    id: UserId,
    createdAt: Date,
    updatedAt: Date,
    deletedAt: Date | null,
    isSystemRole: boolean,
  );
  constructor(
    title: string,
    permissions: Permission[],
    id?: UserId,
    createdAt?: Date,
    updatedAt?: Date,
    deletedAt?: Date | null,
    isSystemRole?: boolean,
  ) {
    this.id = id ?? randomUUID();
    this.title = title;
    this.permissions = permissions ?? [];
    this.createdAt = createdAt ?? now().toJSDate();
    this.updatedAt = updatedAt ?? now().toJSDate();
    this.deletedAt = deletedAt ?? null;
    this.isSystemRole = isSystemRole ?? false;
  }

  readonly id!: string;
  title!: string;
  permissions!: Permission[];
  readonly createdAt!: Date;
  updatedAt!: Date;
  deletedAt!: Date | null;
  readonly isSystemRole!: boolean;
}

export enum Permission {
  MANAGE_EVERY_THINGS = '*',
  READ_ALL = 'read:*',
  WRITE_ALL = 'write:*',
  READ_USERS = 'read:users',
  WRITE_USERS = 'write:users',
  READ_ATTACHMENTS = 'read:attachments',
  WRITE_ATTACHMENTS = 'write:attachments',
  READ_NOTIFICATIONS = 'read:notifications',
  WRITE_NOTIFICATIONS = 'write:notifications',
  READ_ROLES = 'read:roles',
  WRITE_ROLES = 'write:roles',
  WRITE_COUNTRIES = 'write:countries',
}

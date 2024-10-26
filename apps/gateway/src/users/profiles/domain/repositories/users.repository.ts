import { Paginated, PaginationOption } from '@repo/types/database';
import { Email, Mobile, UserId, Username } from '@repo/types/common.types';
import { UserEntity } from '../entities/user.entity';

export const USERS_REPOSITORY_TOKEN = Symbol('UsersRepository');

export interface FindUserOptions {
  ids: UserId[];
  mobiles: Mobile[];
  emails: Email[];
  usernames: Username[];
}

export enum UserOrderBy {
  CREATED_AT = 'created_at',
}

export interface UsersRepository {
  save(data: UserEntity): Promise<UserEntity>;
  findOne(options: Partial<FindUserOptions>): Promise<UserEntity | null>;
  findAll(
    options: Partial<FindUserOptions>,
    pagination?: PaginationOption<UserOrderBy>,
  ): Promise<Paginated<UserEntity>>;
  exists(options: Partial<FindUserOptions>): Promise<boolean>;
  update(options: Partial<FindUserOptions>, data: Partial<UserEntity>): Promise<void>;
}

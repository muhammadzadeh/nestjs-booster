import { Paginated, PaginationOption } from '@repo/types/database';
import { UserId } from '@repo/types/common.types';
import { Permission, RoleEntity } from '../entities/role.entity';

export const ROLES_REPOSITORY_TOKEN = Symbol('RolesRepository');

export interface FindRoleOptions {
  ids: UserId[];
  permissions: Permission[];
}

export enum RoleOrderBy {
  CREATED_AT = 'created_at',
}

export interface RolesRepository {
  save(data: RoleEntity): Promise<RoleEntity>;
  findOne(options: Partial<FindRoleOptions>): Promise<RoleEntity | null>;
  findAll(
    options: Partial<FindRoleOptions>,
    pagination?: PaginationOption<RoleOrderBy>,
  ): Promise<Paginated<RoleEntity>>;
  exists(options: Partial<FindRoleOptions>): Promise<boolean>;
  update(options: Partial<FindRoleOptions>, data: Partial<RoleEntity>): Promise<void>;
}

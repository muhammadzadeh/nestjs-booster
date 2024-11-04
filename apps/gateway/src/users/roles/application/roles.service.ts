import { HttpStatus, Inject, Injectable } from '@nestjs/common';
import { BaseHttpException } from '@repo/exception/base.exception';
import { ErrorCode } from '@repo/types/error-code.enum';
import { Paginated, PaginationOption } from '@repo/types/database';
import { Permission, RoleEntity } from '../domain/entities/role.entity';
import {
  FindRoleOptions,
  ROLES_REPOSITORY_TOKEN,
  RoleOrderBy,
  RolesRepository,
} from '../domain/repositories/roles.repository';

@Injectable()
export class RolesService {
  constructor(@Inject(ROLES_REPOSITORY_TOKEN) private readonly rolesRepository: RolesRepository) {}

  async createRole(data: CreateRoleData): Promise<RoleEntity> {
    return this.rolesRepository.save(new RoleEntity(data.title, data.permissions));
  }

  async updateRole(id: string, data: UpdateRoleData): Promise<void> {
    await this.rolesRepository.update(
      {
        ids: [id],
      },
      data,
    );
  }

  async findOneById(id: string): Promise<RoleEntity> {
    const role = await this.rolesRepository.findOne({ ids: [id] });
    if (!role) {
      throw new RoleNotFoundException();
    }

    return role;
  }

  async findAll(
    options: Partial<FindRoleOptions>,
    pagination?: PaginationOption<RoleOrderBy>,
  ): Promise<Paginated<RoleEntity>> {
    return this.rolesRepository.findAll(options, pagination);
  }
}

export class CreateRoleData {
  readonly title!: string;
  readonly permissions!: Permission[];
}

export class UpdateRoleData extends CreateRoleData {}

export class RoleNotFoundException extends BaseHttpException {
  readonly status: HttpStatus = HttpStatus.NOT_FOUND;
  readonly useOriginalMessage?: boolean;
  readonly code: ErrorCode = ErrorCode.ROLE_NOT_FOUND;
}

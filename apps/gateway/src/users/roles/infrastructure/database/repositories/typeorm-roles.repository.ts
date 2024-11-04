import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { Paginated, PaginationOption } from '@repo/types/database';
import { RoleEntity } from '../../../domain/entities/role.entity';
import { FindRoleOptions, RoleOrderBy, RolesRepository } from '../../../domain/repositories/roles.repository';
import { TypeormRoleEntity } from '../entities/typeorm-role.entity';

@Injectable()
export class TypeormRolesRepository implements RolesRepository {
  constructor(
    @InjectRepository(TypeormRoleEntity)
    private readonly repository: Repository<TypeormRoleEntity>,
  ) {}

  async exists(options: Partial<FindRoleOptions>): Promise<boolean> {
    const queryBuilder = this.buildSelectQuery(options, 'role');
    return queryBuilder.getExists();
  }

  async save(data: RoleEntity): Promise<RoleEntity> {
    const item = await this.repository.save(data);
    return TypeormRoleEntity.toRoleEntity(item);
  }

  async findOne(options: Partial<FindRoleOptions>): Promise<RoleEntity | null> {
    const queryBuilder = this.buildSelectQuery(options);
    const item = await queryBuilder.getOne();
    return item ? TypeormRoleEntity.toRoleEntity(item) : null;
  }

  async findAll(
    options: Partial<FindRoleOptions>,
    pagination?: PaginationOption<RoleOrderBy>,
  ): Promise<Paginated<RoleEntity>> {
    const queryBuilder = this.buildSelectQuery(options, 'role');

    if (pagination?.orderBy) {
      queryBuilder.addOrderBy(`role.${pagination.orderBy}`, pagination.orderDir);
    }

    if (pagination?.page) {
      queryBuilder.take(pagination?.pageSize).skip((pagination?.page - 1) * pagination?.pageSize);
    }

    const result = await queryBuilder.getManyAndCount();

    return {
      items: result[0].map((item) => TypeormRoleEntity.toRoleEntity(item)),
      total: result[1],
    };
  }

  async update(options: Partial<FindRoleOptions>, data: Partial<RoleEntity>): Promise<void> {
    const queryBuilder = this.buildSelectQuery(options);
    await queryBuilder.update(TypeormRoleEntity).set(data).execute();
  }

  private buildSelectQuery(options: Partial<FindRoleOptions>, alias?: string): SelectQueryBuilder<TypeormRoleEntity> {
    const queryBuilder = this.repository.createQueryBuilder(alias);
    if (options.permissions) {
      queryBuilder.andWhere(`${alias ? alias + '.' : ''}permissions @> ARRAY[:...permissions]::character varying[]`, {
        permissions: options.permissions,
      });
    }
    if (options.ids) {
      queryBuilder.andWhere(`${alias ? alias + '.' : ''}id IN (:...ids)`, { ids: options.ids });
    }
    return queryBuilder;
  }
}

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { Paginated, PaginationOption } from '@repo/types/database';
import { UserEntity } from '../../../domain/entities/user.entity';
import { FindUserOptions, UserOrderBy, UsersRepository } from '../../../domain/repositories/users.repository';
import { TypeormUserEntity } from '../entities/typeorm-user.entity';

@Injectable()
export class TypeormUsersRepository implements UsersRepository {
  constructor(
    @InjectRepository(TypeormUserEntity)
    private readonly repository: Repository<TypeormUserEntity>,
  ) {}

  async exists(options: Partial<FindUserOptions>): Promise<boolean> {
    const queryBuilder = this.buildSelectQuery(options, 'user');
    return queryBuilder.getExists();
  }

  async save(data: UserEntity): Promise<UserEntity> {
    const item = await this.repository.save(data);
    return TypeormUserEntity.toUserEntity(item);
  }

  async findOne(options: Partial<FindUserOptions>): Promise<UserEntity | null> {
    const queryBuilder = this.buildSelectQuery(options);
    const item = await queryBuilder.getOne();
    return item ? TypeormUserEntity.toUserEntity(item) : null;
  }

  async findAll(
    options: Partial<FindUserOptions>,
    pagination?: PaginationOption<UserOrderBy>,
  ): Promise<Paginated<UserEntity>> {
    const queryBuilder = this.buildSelectQuery(options, 'user');

    if (pagination?.orderBy) {
      queryBuilder.addOrderBy(`user.${pagination.orderBy}`, pagination.orderDir);
    }

    if (pagination?.page) {
      queryBuilder.take(pagination?.pageSize).skip((pagination?.page - 1) * pagination?.pageSize);
    }

    const result = await queryBuilder.getManyAndCount();

    return {
      items: result[0].map((item) => TypeormUserEntity.toUserEntity(item)),
      total: result[1],
    };
  }

  async update(options: Partial<FindUserOptions>, data: Partial<UserEntity>): Promise<void> {
    const queryBuilder = this.buildSelectQuery(options);
    await queryBuilder.update(TypeormUserEntity).set(data).execute();
  }

  private buildSelectQuery(options: Partial<FindUserOptions>, alias?: string): SelectQueryBuilder<TypeormUserEntity> {
    const queryBuilder = this.repository.createQueryBuilder(alias);
    if (options.emails) {
      queryBuilder.andWhere(`${alias ? alias + '.' : ''}email IN (:...emails)`, { emails: options.emails });
    }
    if (options.mobiles) {
      queryBuilder.andWhere(`${alias ? alias + '.' : ''}mobile IN (:...mobiles)`, { mobiles: options.mobiles });
    }
    if (options.ids) {
      queryBuilder.andWhere(`${alias ? alias + '.' : ''}id IN (:...ids)`, { ids: options.ids });
    }
    if (options.usernames) {
      queryBuilder.andWhere(`${alias ? alias + '.' : ''}username IN (:...usernames)`, { usernames: options.usernames });
    }
    return queryBuilder;
  }
}

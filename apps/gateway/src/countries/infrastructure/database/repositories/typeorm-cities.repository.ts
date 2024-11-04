import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { Paginated, PaginationOption } from '@repo/types/database';
import { CityEntity } from '../../../domain/entities/city.entity';
import { CitiesRepository, CityOrderBy, FindCityOptions } from '../../../domain/repositories/cities.repository';
import { TypeormCityEntity } from '../entities/typeorm-city.entity';

@Injectable()
export class TypeormCitiesRepository implements CitiesRepository {
  constructor(
    @InjectRepository(TypeormCityEntity)
    private readonly repository: Repository<TypeormCityEntity>,
  ) {}

  async findAll(
    options: Partial<FindCityOptions>,
    pagination?: PaginationOption<CityOrderBy> | undefined,
  ): Promise<Paginated<CityEntity>> {
    const queryBuilder = this.buildSelectQuery(options, 'city');

    if (pagination?.orderBy) {
      queryBuilder.addOrderBy(`city.${pagination.orderBy}`, pagination.orderDir);
    }

    if (pagination?.page) {
      queryBuilder.take(pagination?.pageSize).skip((pagination?.page - 1) * pagination?.pageSize);
    }

    const result = await queryBuilder.getManyAndCount();

    return {
      items: result[0].map((item) => TypeormCityEntity.toCityEntity(item)),
      total: result[1],
    };
  }
  async exists(options: Partial<FindCityOptions>): Promise<boolean> {
    const queryBuilder = this.buildSelectQuery(options, 'city');
    return queryBuilder.getExists();
  }

  private buildSelectQuery(options: Partial<FindCityOptions>, alias?: string): SelectQueryBuilder<TypeormCityEntity> {
    const queryBuilder = this.repository.createQueryBuilder(alias);

    if (options.searchTerm) {
      queryBuilder.andWhere(`${alias ? alias + '.' : ''}name ILIKE :name`, { name: `%${options.searchTerm}%` });
    }
    if (options.stateId) {
      queryBuilder.andWhere(`${alias ? alias + '.' : ''}stateId = :stateId`, { stateId: options.stateId });
    }
    return queryBuilder;
  }
}

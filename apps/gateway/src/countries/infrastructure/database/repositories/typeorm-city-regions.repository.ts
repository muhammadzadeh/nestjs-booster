import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { Paginated, PaginationOption } from '@repo/types/database';
import { CityRegionEntity } from '../../../domain/entities/city-region.entity';
import {
  CityRegionOrderBy,
  CityRegionsRepository,
  FindCityRegionOptions,
} from '../../../domain/repositories/city-regions.repository';
import { TypeormCityRegionEntity } from '../entities/typeorm-city-region.entity';

@Injectable()
export class TypeormCityRegionsRepository implements CityRegionsRepository {
  constructor(
    @InjectRepository(TypeormCityRegionEntity)
    private readonly repository: Repository<TypeormCityRegionEntity>,
  ) {}

  async save(data: CityRegionEntity): Promise<CityRegionEntity> {
    const item = await this.repository.save(data);
    return TypeormCityRegionEntity.toCityRegionEntity(item);
  }

  async findAll(
    options: Partial<FindCityRegionOptions>,
    pagination?: PaginationOption<CityRegionOrderBy> | undefined,
  ): Promise<Paginated<CityRegionEntity>> {
    const queryBuilder = this.buildSelectQuery(options, 'region');

    if (pagination?.orderBy) {
      queryBuilder.addOrderBy(`region.${pagination.orderBy}`, pagination.orderDir);
    }

    if (pagination?.page) {
      queryBuilder.take(pagination?.pageSize).skip((pagination?.page - 1) * pagination?.pageSize);
    }

    const result = await queryBuilder.getManyAndCount();

    return {
      items: result[0].map((item) => TypeormCityRegionEntity.toCityRegionEntity(item)),
      total: result[1],
    };
  }
  async exists(options: Partial<FindCityRegionOptions>): Promise<boolean> {
    const queryBuilder = this.buildSelectQuery(options, 'region');
    return queryBuilder.getExists();
  }

  private buildSelectQuery(
    options: Partial<FindCityRegionOptions>,
    alias?: string,
  ): SelectQueryBuilder<TypeormCityRegionEntity> {
    const queryBuilder = this.repository.createQueryBuilder(alias);

    if (options.searchTerm) {
      queryBuilder.andWhere(`${alias ? alias + '.' : ''}name ILIKE :name`, { name: `%${options.searchTerm}%` });
    }
    if (options.cityId) {
      queryBuilder.andWhere(`${alias ? alias + '.' : ''}cityId = :cityId`, { cityId: options.cityId });
    }
    return queryBuilder;
  }
}

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { Paginated, PaginationOption } from '@repo/types/database';
import { CountryEntity } from '../../../domain/entities/country.entity';
import {
  CountriesRepository,
  FindRegionOptions,
  RegionOrderBy,
} from '../../../domain/repositories/countries.repository';
import { TypeormCountryEntity } from '../entities/typeorm-country.entity';

@Injectable()
export class TypeormCountriesRepository implements CountriesRepository {
  constructor(
    @InjectRepository(TypeormCountryEntity)
    private readonly repository: Repository<TypeormCountryEntity>,
  ) {}

  async findAll(
    options: Partial<FindRegionOptions>,
    pagination?: PaginationOption<RegionOrderBy>,
  ): Promise<Paginated<CountryEntity>> {
    const queryBuilder = this.buildSelectQuery(options, 'country');

    if (pagination?.orderBy) {
      queryBuilder.addOrderBy(`country.${pagination.orderBy}`, pagination.orderDir);
    }

    if (pagination?.page) {
      queryBuilder.take(pagination?.pageSize).skip((pagination?.page - 1) * pagination?.pageSize);
    }

    const result = await queryBuilder.getManyAndCount();

    return {
      items: result[0].map((item) => TypeormCountryEntity.toCountryEntity(item)),
      total: result[1],
    };
  }

  async exists(options: Partial<FindRegionOptions>): Promise<boolean> {
    const queryBuilder = this.buildSelectQuery(options, 'country');
    return queryBuilder.getExists();
  }

  private buildSelectQuery(
    options: Partial<FindRegionOptions>,
    alias?: string,
  ): SelectQueryBuilder<TypeormCountryEntity> {
    const queryBuilder = this.repository.createQueryBuilder(alias);

    if (options.searchTerm) {
      queryBuilder.andWhere(`${alias ? alias + '.' : ''}name ILIKE :name`, { name: `%${options.searchTerm}%` });
    }
    return queryBuilder;
  }
}

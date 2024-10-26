import { Paginated, PaginationOption } from '@repo/types/database';
import { CountryEntity } from '../entities/country.entity';

export const COUNTRIES_REPOSITORY_TOKEN = Symbol('CountriesRepository');

export interface FindRegionOptions {
  searchTerm: string;
}

export enum RegionOrderBy {
  NAME = 'name',
}

export interface CountriesRepository {
  findAll(
    options: Partial<FindRegionOptions>,
    pagination?: PaginationOption<RegionOrderBy>,
  ): Promise<Paginated<CountryEntity>>;
  exists(options: Partial<FindRegionOptions>): Promise<boolean>;
}

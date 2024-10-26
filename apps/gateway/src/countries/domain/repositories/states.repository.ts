import { Paginated, PaginationOption } from '@repo/types/database';
import { StateEntity } from '../entities/state.entity';

export const STATES_REPOSITORY_TOKEN = Symbol('StatesRepository');

export interface FindStateOptions {
  countryId: string;
  searchTerm: string;
}

export enum StateOrderBy {
  NAME = 'name',
}

export interface StatesRepository {
  findAll(
    options: Partial<FindStateOptions>,
    pagination?: PaginationOption<StateOrderBy>,
  ): Promise<Paginated<StateEntity>>;
  exists(options: Partial<FindStateOptions>): Promise<boolean>;
}

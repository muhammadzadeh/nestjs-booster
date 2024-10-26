import { Injectable, SetMetadata, applyDecorators } from '@nestjs/common';
import { OrderDir } from '@repo/types/common.enums';

export abstract class BaseSeeder {
  abstract run(): Promise<void>;
}

export const DATABASE_SEEDER_TAG = 'database_seeder_tag';
export const DatabaseSeeder = () => applyDecorators(Injectable(), SetMetadata(DATABASE_SEEDER_TAG, true));

export interface Paginated<T> {
  items: T[];
  total: number;
}

export interface Pagination {
  page: number;
  pageSize: number;
}

export interface PaginationOption<T> extends Pagination {
  orderBy: T;
  orderDir: OrderDir;
}

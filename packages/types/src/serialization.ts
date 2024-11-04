import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { MIN_PAGE_NUMBER, MIN_PAGE_SIZE } from './constants';

export interface PagedResponseMeta {
  readonly total: number;
  readonly pageSize: number;
  readonly page: number;
}

export class PaginationMetaResponse {
  @ApiProperty({
    type: Number,
    description: 'Total items',
  })
  @Type(() => Number)
  total: number;

  @ApiProperty({
    type: Number,
    description: 'Items count per page',
    example: 20,
  })
  @Type(() => Number)
  pageSize: number;

  @ApiProperty({
    type: Number,
    description: 'Current Page',
    example: 1,
  })
  @Type(() => Number)
  currentPage: number;

  @ApiProperty({
    type: Number,
    description: 'Last page number',
    example: 100,
  })
  @Type(() => Number)
  lastPage: number;

  @ApiProperty({
    type: Number,
    description: 'returned items from index',
    example: 10,
  })
  @Type(() => Number)
  from: number;

  @ApiProperty({
    type: Number,
    description: 'returned items to index',
    example: 20,
  })
  @Type(() => Number)
  to: number;

  constructor(total: number, page: number, pageSize: number) {
    this.total = total;
    this.pageSize = pageSize;
    this.currentPage = page;
    this.lastPage = Math.ceil(total / pageSize);
    this.from = (page - 1) * pageSize + 1;
    this.to = this.lastPage == page ? total : this.from + pageSize - 1;
  }
}

export class ListMetaResponse {
  @ApiProperty({
    type: PaginationMetaResponse,
    description: 'pagination meta',
  })
  @Type(() => PaginationMetaResponse)
  pagination!: PaginationMetaResponse;
}

export class ListResponse<T> {
  readonly items!: T[];

  @ApiProperty({
    type: ListMetaResponse,
    description: 'pagination meta',
  })
  @Type(() => ListMetaResponse)
  readonly meta!: ListMetaResponse;

  constructor();
  constructor(items: T[], stats: { total: number; page?: number; pageSize?: number });
  constructor(items?: T[], stats?: { total: number; page?: number; pageSize?: number }) {
    this.items = items ?? [];
    this.meta = {
      pagination: new PaginationMetaResponse(
        stats?.total ?? 0,
        stats?.page ?? MIN_PAGE_NUMBER,
        stats?.pageSize ?? MIN_PAGE_SIZE,
      ),
    };
  }
}

export class DoneResponse {
  @ApiProperty({
    type: String,
    example: 'OK',
  })
  @Type(() => String)
  message!: string;
}

import { Type } from 'class-transformer';
import { IsEnum, IsNotEmpty, IsNumber, Max, Min } from 'class-validator';
import { OrderDir } from './common.enums';
import { MAX_PAGE_SIZE } from './constants';
import { ApiProperty } from '@nestjs/swagger';

export class PaginationDto {

  @ApiProperty({ example: 1, description: 'The page number' })
  @Min(1)
  @Max(10_000)
  @IsNumber()
  @IsNotEmpty()
  @Type(() => Number)
  page!: number;

  @ApiProperty({ example: 20, description: 'Number of items per page' })
  @Min(1)
  @Max(MAX_PAGE_SIZE)
  @IsNumber()
  @IsNotEmpty()
  @Type(() => Number)
  pageSize!: number;

  @ApiProperty({ enum: OrderDir, enumName:'OrderDir', description: 'Order direction' })
  @IsEnum(OrderDir)
  @IsNotEmpty()
  orderDir!: OrderDir;
}

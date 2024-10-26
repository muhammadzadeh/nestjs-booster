import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { PaginationDto } from '@repo/types/pagination.dto';
import { StateOrderBy } from '../../domain/repositories/states.repository';

export class FilterStateDto extends PaginationDto {
  @IsNotEmpty()
  @IsEnum(StateOrderBy)
  orderBy!: StateOrderBy;

  @IsOptional()
  @IsString()
  searchTerm?: string;
}

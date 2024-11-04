import { IsEnum, IsNotEmpty } from 'class-validator';
import { PaginationDto } from '@repo/types/pagination.dto';
import { UserOrderBy } from '../../../domain/repositories/users.repository';

export class FilterUserDto extends PaginationDto {
  @IsNotEmpty()
  @IsEnum(UserOrderBy)
  orderBy!: UserOrderBy;
}

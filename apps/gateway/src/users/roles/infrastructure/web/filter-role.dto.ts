import { IsEnum, IsNotEmpty } from 'class-validator';
import { RoleOrderBy } from '../../domain/repositories/roles.repository';
import { PaginationDto } from '@repo/types/pagination.dto';

export class FilterRoleDto extends PaginationDto {
  @IsNotEmpty()
  @IsEnum(RoleOrderBy)
  orderBy!: RoleOrderBy;
}

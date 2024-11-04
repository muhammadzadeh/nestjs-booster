import { IsArray, IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { Permission } from '../../domain/entities/role.entity';

export class CreateRoleDto {
  @IsNotEmpty()
  @IsString()
  readonly title!: string;

  @IsNotEmpty()
  @IsArray()
  @IsEnum(Permission, { each: true })
  readonly permissions!: Permission[];
}

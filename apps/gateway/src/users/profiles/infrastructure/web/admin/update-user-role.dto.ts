import { IsOptional, IsUUID } from 'class-validator';
import { UserEntity } from '../../../domain/entities/user.entity';

export class UpdateUserRoleDto {
  @IsOptional()
  @IsUUID('4')
  roleId?: string;

  toEntity(): Partial<UserEntity>{
    return {
      roleId: this.roleId,
    }
  }
}

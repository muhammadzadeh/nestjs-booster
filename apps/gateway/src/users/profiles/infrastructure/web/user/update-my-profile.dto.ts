import { IsOptional, IsString, IsUUID } from 'class-validator';
import { UserEntity } from '../../../domain/entities/user.entity';

export class UpdateMyProfileDto {
  @IsOptional()
  @IsString()
  firstName!: string | null;

  @IsOptional()
  @IsString()
  lastName!: string | null;

  @IsOptional()
  @IsUUID('4')
  avatar!: string | null;

  toEntity(): Partial<UserEntity> {
    return {
      firstName: this.firstName ?? null,
      lastName: this.lastName ?? null,
      avatarId: this.avatar ?? null,
      fullName: `${this.firstName ?? ''} ${this.lastName ?? ''}`,
    };
  }
}

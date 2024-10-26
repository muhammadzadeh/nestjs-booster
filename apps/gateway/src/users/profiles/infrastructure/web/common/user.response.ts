import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { Email, Mobile, UserId, Username } from '@repo/types/common.types';
import { UserEntity } from '../../../domain/entities/user.entity';
import { AvatarResponse } from './avatar.response';

export class UserResponse {
  static from(data: UserEntity): UserResponse {
    return {
      id: data.id,
      firstName: data.firstName,
      lastName: data.lastName,
      fullName: data.fullName,
      email: data.email,
      mobile: data.mobile,
      username: data.username,
      isBlocked: data.isBlocked,
      isEmailVerified: data.isEmailVerified,
      isMobileVerified: data.isMobileVerified,
      roleId: data.roleId,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
      deletedAt: data.deletedAt,
      lastLoggedInAt: data.lastLoggedInAt,
      passwordUpdatedAt: data.passwordUpdatedAt,
      avatar:
        data.avatar && data.avatarId
          ? {
              id: data.avatarId,
              url: data.avatar,
            }
          : null,
    };
  }

  @ApiProperty({
    type: String,
  })
  @Type(() => String)
  readonly id!: UserId;

  @ApiProperty({
    type: String,
    nullable: true,
  })
  @Type(() => String)
  readonly firstName!: string | null;

  @ApiProperty({
    type: String,
    nullable: true,
  })
  @Type(() => String)
  readonly lastName!: string | null;

  @ApiProperty({
    type: String,
    nullable: true,
  })
  @Type(() => String)
  readonly fullName!: string | null;

  @ApiProperty({
    type: String,
    nullable: true,
  })
  @Type(() => String)
  readonly email!: Email | null;

  @ApiProperty({
    type: String,
    nullable: true,
  })
  @Type(() => String)
  readonly mobile!: Mobile | null;

  @ApiProperty({
    type: AvatarResponse,
    nullable: true,
  })
  @Type(() => AvatarResponse)
  readonly avatar!: AvatarResponse | null;

  @ApiProperty({
    type: String,
    nullable: true,
  })
  @Type(() => String)
  readonly username!: Username | null;

  @ApiProperty({
    type: Boolean,
  })
  @Type(() => Boolean)
  readonly isBlocked!: boolean;

  @ApiProperty({
    type: Boolean,
  })
  @Type(() => Boolean)
  readonly isEmailVerified!: boolean;

  @ApiProperty({
    type: Boolean,
  })
  @Type(() => Boolean)
  readonly isMobileVerified!: boolean;

  @ApiProperty({
    type: String,
    nullable: true,
  })
  @Type(() => String)
  readonly roleId!: string | null;

  @ApiProperty({
    type: Date,
  })
  @Type(() => Date)
  readonly createdAt!: Date;

  @ApiProperty({
    type: Date,
    nullable: true,
  })
  @Type(() => Date)
  readonly updatedAt!: Date;

  @ApiProperty({
    type: Date,
    nullable: true,
  })
  @Type(() => Date)
  readonly deletedAt!: Date | null;

  @ApiProperty({
    type: Date,
    nullable: true,
  })
  @Type(() => Date)
  readonly lastLoggedInAt!: Date | null;

  @ApiProperty({
    type: Date,
    nullable: true,
  })
  @Type(() => Date)
  readonly passwordUpdatedAt!: Date | null;
}

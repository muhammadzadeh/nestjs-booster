import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { Permission, RoleEntity } from '../../domain/entities/role.entity';

export class RoleResponse {
  static from(data: RoleEntity): RoleResponse {
    return {
      id: data.id,
      title: data.title,
      permissions: data.permissions,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
      deletedAt: data.deletedAt,
      isSystemRole: data.isSystemRole,
    };
  }
  @ApiProperty({
    type: String,
  })
  @Type(() => String)
  readonly id!: string;

  @ApiProperty({
    type: String,
  })
  @Type(() => String)
  readonly title!: string;

  @ApiProperty({
    type: Permission,
    enum: Permission,
    enumName: 'Permission',
    isArray: true,
  })
  @Type(() => String)
  readonly permissions!: Permission[];

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
    type: Boolean,
  })
  @Type(() => Boolean)
  readonly isSystemRole!: boolean;
}

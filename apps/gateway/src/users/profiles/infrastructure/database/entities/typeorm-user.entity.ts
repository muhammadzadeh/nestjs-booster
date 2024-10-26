import { Check, Column, Entity, Index, PrimaryGeneratedColumn, Unique } from 'typeorm';
import { Email, Mobile, UserId, Username } from '@repo/types/common.types';
import { UserEntity } from '../../../domain/entities/user.entity';

@Entity({
  name: 'users',
})
@Check('users_identifier_check', 'email IS NOT NULL OR mobile IS NOT NULL')
@Unique('users_email_u', ['email'])
@Unique('users_mobile_u', ['mobile'])
export class TypeormUserEntity {
  @PrimaryGeneratedColumn('uuid', { primaryKeyConstraintName: 'users_id_pkey' })
  readonly id!: UserId;

  @Column({ type: 'varchar', name: 'fist_name', nullable: true })
  readonly firstName!: string | null;

  @Column({ type: 'varchar', name: 'last_name', nullable: true })
  readonly lastName!: string | null;

  @Column({ type: 'varchar', name: 'full_name', nullable: true })
  readonly fullName!: string | null;

  @Column({ type: 'varchar', name: 'email', nullable: true })
  @Index('users_email_idx')
  readonly email!: Email | null;

  @Column({ type: 'varchar', name: 'mobile', nullable: true })
  @Index('users_mobile_idx')
  readonly mobile!: Mobile | null;

  @Column({ type: 'varchar', name: 'avatar', nullable: true })
  readonly avatar!: string | null;

  @Column({ type: 'uuid', name: 'avatar_id', nullable: true })
  readonly avatarId!: string | null;

  @Column({ type: 'varchar', name: 'password', nullable: true })
  readonly password!: string | null;

  @Column({ type: 'varchar', name: 'username', nullable: true })
  readonly username!: Username | null;

  @Column({ type: 'boolean', name: 'is_blocked', default: false })
  readonly isBlocked!: boolean;

  @Column({ type: 'boolean', name: 'is_email_verified', default: false })
  readonly isEmailVerified!: boolean;

  @Column({ type: 'boolean', name: 'is_mobile_verified', default: false })
  readonly isMobileVerified!: boolean;

  @Column({ type: 'uuid', name: 'role_id', nullable: true })
  readonly roleId!: string | null;

  @Column({ type: 'timestamptz', name: 'created_at', default: 'now()' })
  readonly createdAt!: Date;

  @Column({ type: 'timestamptz', name: 'updated_at', default: 'now()' })
  readonly updatedAt!: Date;

  @Column({ type: 'timestamptz', nullable: true, name: 'deleted_at' })
  readonly deletedAt!: Date | null;

  @Column({ type: 'timestamptz', name: 'last_logged_in_at', nullable: true })
  readonly lastLoggedInAt!: Date | null;

  @Column({ type: 'timestamptz', name: 'password_updated_at', nullable: true })
  readonly passwordUpdatedAt!: Date | null;

  static toUserEntity(item: TypeormUserEntity): UserEntity {
    return new UserEntity(
      item.firstName,
      item.lastName,
      item.email,
      item.mobile,
      item.avatar,
      item.avatarId,
      item.password,
      item.username,
      item.id,
      item.fullName,
      item.isBlocked,
      item.isEmailVerified,
      item.isMobileVerified,
      item.roleId,
      item.createdAt,
      item.updatedAt,
      item.deletedAt,
      item.lastLoggedInAt,
      item.passwordUpdatedAt,
    );
  }
}

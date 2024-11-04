import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { Permission, RoleEntity } from '../../../domain/entities/role.entity';

@Entity({
  name: 'roles',
})
export class TypeormRoleEntity {
  @PrimaryGeneratedColumn('uuid', { primaryKeyConstraintName: 'roles_id_pkey' })
  readonly id!: string;

  @Column({ type: 'varchar', name: 'title' })
  readonly title!: string;

  @Column({ type: 'varchar', name: 'permissions', default: [], array: true })
  readonly permissions!: Permission[];

  @Column({ type: 'timestamptz', name: 'created_at', default: 'now()' })
  readonly createdAt!: Date;

  @Column({ type: 'timestamptz', name: 'updated_at', default: 'now()' })
  readonly updatedAt!: Date;

  @Column({ type: 'timestamptz', nullable: true, name: 'deleted_at' })
  readonly deletedAt!: Date | null;

  @Column({ type: 'boolean', name: 'is_system_role' })
  readonly isSystemRole!: boolean;

  static toRoleEntity(item: TypeormRoleEntity): RoleEntity {
    return new RoleEntity(
      item.title,
      item.permissions,
      item.id,
      item.createdAt,
      item.updatedAt,
      item.deletedAt,
      item.isSystemRole,
    );
  }
}

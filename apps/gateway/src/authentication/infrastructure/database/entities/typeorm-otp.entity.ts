import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { OTPEntity, OTPReason, OTPType } from '../../../domain/entities';

@Entity({ name: 'otp_logs' })
export class TypeormOTPEntity {
  @PrimaryGeneratedColumn('uuid', { primaryKeyConstraintName: 'otp_logs_id_pkey' })
  readonly id!: string;

  @Column({ type: 'varchar' })
  readonly destination!: string;

  @Column({ type: 'varchar' })
  readonly otp!: string;

  @Column({ type: 'uuid', name: 'user_id' })
  readonly userId!: string;

  @Column({ type: 'enum', enum: OTPType })
  readonly type!: OTPType;

  @Column({ type: 'enum', enum: OTPReason })
  readonly reason!: OTPReason;

  @Column({ type: 'timestamptz', nullable: true, name: 'expire_at' })
  readonly expireAt!: Date | null;

  @Column({ type: 'timestamptz', nullable: true, name: 'used_at' })
  readonly usedAt!: Date | null;

  @Column({ type: 'timestamptz', name: 'created_at', default: 'now()' })
  readonly createdAt!: Date;

  @Column({ type: 'timestamptz', name: 'updated_at', default: 'now()' })
  readonly updatedAt!: Date;

  @Column({ type: 'timestamptz', nullable: true, name: 'deleted_at' })
  readonly deletedAt!: Date | null;

  public static toOTPEntity(input: TypeormOTPEntity): OTPEntity {
    return new OTPEntity(
      input.userId,
      input.destination,
      input.type,
      input.reason,
      input.expireAt,
      input.otp,
      input.id,
      input.usedAt,
      input.createdAt,
      input.updatedAt,
      input.deletedAt,
    );
  }
}

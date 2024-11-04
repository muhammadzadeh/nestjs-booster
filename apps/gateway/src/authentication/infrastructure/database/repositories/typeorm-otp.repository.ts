import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OTPEntity, OTPReason, OTPType } from '../../../domain/entities';
import { FindOTPData, OTPRepository } from '../../../domain/repositories';
import { TypeormOTPEntity } from '../entities';

@Injectable()
export class TypeOrmOTPRepository implements OTPRepository {
  constructor(
    @InjectRepository(TypeormOTPEntity)
    private readonly repository: Repository<TypeormOTPEntity>,
  ) {}

  async save(input: OTPEntity): Promise<OTPEntity> {
    const item = await this.repository.save(input);
    return TypeormOTPEntity.toOTPEntity(item);
  }

  async findOne(input: FindOTPData): Promise<OTPEntity | null> {
    const { type, otp } = input;

    const item = await this.repository
      .createQueryBuilder('otp')
      .andWhere('otp.type = :type', { type })
      .andWhere('otp.otp = :otp', { otp })
      .andWhere('otp.used_at IS NULL')
      .andWhere('otp.expire_at > NOW()')
      .andWhere('otp.deleted_at IS NULL')
      .getOne();

    return item ? TypeormOTPEntity.toOTPEntity(item) : null;
  }

  async exists(otp: string): Promise<boolean> {
    return this.repository
      .createQueryBuilder('otp')
      .where('otp.otp = :otp', { otp })
      .andWhere('otp.deleted_at IS NULL')
      .getExists();
  }

  existActiveOtp(userId: string, type: OTPType, reason: OTPReason): Promise<boolean> {
    return this.repository
      .createQueryBuilder('otp')
      .where('otp.user_id = :userId', { userId })
      .andWhere('otp.type = :type', { type })
      .andWhere('otp.reason = :reason', { reason })
      .andWhere('otp.used_at IS NULL')
      .andWhere('otp.expire_at > NOW()')
      .andWhere('otp.deleted_at IS NULL')
      .getExists();
  }
}

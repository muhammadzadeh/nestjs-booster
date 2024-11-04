import { randomUUID } from 'crypto';
import { now } from '@repo/utils/time';

export enum OTPType {
  CODE = 'code',
  TOKEN = 'token',
}

export enum OTPReason {
  LOGIN = 'login',
  VERIFY = 'verify',
  RESET_PASSWORD = 'reset_password',
}

class InvalidOTPException extends Error {}

export class OTPEntity {
  constructor(userId: string, destination: string, type: OTPType, reason: OTPReason, expireAt: Date, otp: string);
  constructor(
    userId: string,
    destination: string,
    type: OTPType,
    reason: OTPReason,
    expireAt: Date | null,
    otp: string,
    id?: string,
    usedAt?: Date | null,
    createdAt?: Date,
    updatedAt?: Date,
    deletedAt?: Date | null,
  );
  constructor(
    userId: string,
    destination: string,
    type: OTPType,
    reason: OTPReason,
    expireAt: Date | null,
    otp: string,
    id?: string,
    usedAt?: Date | null,
    createdAt?: Date,
    updatedAt?: Date,
    deletedAt?: Date | null,
  ) {
    this.id = id ?? randomUUID().toString();
    this.destination = destination;
    this.userId = userId;
    this.otp = otp;
    this.type = type;
    this.reason = reason;
    this.createdAt = createdAt ?? now().toJSDate();
    this.updatedAt = updatedAt ?? now().toJSDate();
    this.expireAt = expireAt;
    this.usedAt = usedAt ?? null;
    this.deletedAt = deletedAt ?? null;
  }

  id!: string;
  destination!: string;
  userId!: string;
  otp!: string;
  type!: OTPType;
  reason!: OTPReason;
  createdAt!: Date;
  updatedAt!: Date;
  expireAt!: Date | null;
  usedAt!: Date | null;
  deletedAt!: Date | null;

  verify(destination: string | undefined): void {
    if (this.isUsed()) {
      throw new InvalidOTPException(`OTP (${this.id}) already used`);
    }

    if (this.isExpired()) {
      throw new InvalidOTPException(`OTP (${this.id}) Expired`);
    }

    if (this.isCode() && !this.isDestinationMatch(destination)) {
      throw new InvalidOTPException(`OTP (${this.id}) Mismatch destination (${destination})`);
    }
  }

  isExpired(): boolean {
    return this.expireAt ? this.expireAt.getTime() < now().toJSDate().getTime() : false;
  }

  isUsed(): boolean {
    return this.usedAt !== null;
  }

  isDestinationMatch(destination: string | undefined): boolean {
    return this.destination === destination;
  }

  isCode(): boolean {
    return this.type === OTPType.CODE;
  }

  isToken(): boolean {
    return this.type === OTPType.TOKEN;
  }

  markAsUsed(): void {
    this.usedAt = now().toJSDate();
  }
}

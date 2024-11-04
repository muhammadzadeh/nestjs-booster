import { OTPEntity, OTPReason, OTPType } from '../entities';

export interface FindOTPData {
  type: OTPType;
  otp: string;
  reason: OTPReason;
}

export const OTP_REPOSITORY_TOKEN = Symbol('OTPRepository');

export interface OTPRepository {
  save(input: OTPEntity): Promise<OTPEntity>;
  findOne(input: FindOTPData): Promise<OTPEntity | null>;
  exists(otp: string): Promise<boolean>;
  existActiveOtp(userId: string, type: OTPType, reason: OTPReason): Promise<boolean>;
}

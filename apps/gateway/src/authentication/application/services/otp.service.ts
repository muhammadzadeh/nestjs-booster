import { HttpStatus, Inject, Injectable } from '@nestjs/common';
import { BaseHttpException } from '@repo/exception/base.exception';
import { ErrorCode } from '@repo/types/error-code.enum';
import { createHash } from 'crypto';
import { Duration } from 'luxon';
import { randomStringSync } from '../../../common/string';
import { now } from '../../../common/time';
import { Email, Mobile, UserId } from '@repo/types/common.types';
import { OTPEntity, OTPReason, OTPType } from '../../domain/entities';
import { OTPRepository, OTP_REPOSITORY_TOKEN } from '../../domain/repositories';

class OtpNotFoundException extends BaseHttpException {
  readonly status: HttpStatus = HttpStatus.BAD_REQUEST;
  readonly useOriginalMessage?: boolean;
  readonly code: ErrorCode = ErrorCode.OTP_NOT_FOUND;
}

class OtpDestinationInvalidException extends BaseHttpException {
  readonly status: HttpStatus = HttpStatus.BAD_REQUEST;
  readonly useOriginalMessage?: boolean;
  readonly code: ErrorCode = ErrorCode.OTP_DESTINATION_INVALID;
}

const DEFAULT_TOKEN_OTP_DURATION = Duration.fromISO('PT15M');
const DEFAULT_CODE_OTP_DURATION = Duration.fromISO('PT5M');
export class OtpGeneration {
  constructor(
    readonly userId: UserId,
    readonly mobile: Mobile | undefined,
    readonly email: Email | undefined,
    readonly type: OTPType,
    readonly reason: OTPReason,
    readonly ttl: Duration = type === OTPType.CODE ? DEFAULT_CODE_OTP_DURATION : DEFAULT_TOKEN_OTP_DURATION,
  ) {
    this.expireAt = now().plus(this.ttl).toJSDate();
  }

  readonly expireAt: Date;
}

export class OtpVerification {
  constructor(
    readonly otp: string,
    readonly type: OTPType,
    readonly reason: OTPReason,
    readonly email?: string,
    readonly mobile?: string,
  ) {}
}

export class OTPVerificationResult {
  readonly userId!: string;
}

@Injectable()
export class OtpService {
  constructor(@Inject(OTP_REPOSITORY_TOKEN) private readonly otpRepository: OTPRepository) {}

  async generate(otpGeneration: OtpGeneration): Promise<string> {
    const destination = otpGeneration.mobile ?? otpGeneration.email;

    if (!destination) {
      throw new OtpDestinationInvalidException('OTP generation failed, Mobile or Email is required');
    }

    const otp = await this.generateUniqueOTP(otpGeneration.type);
    const hashedOtp = this.createSHA256Hash(otp);
    const otpRecord = new OTPEntity(
      otpGeneration.userId,
      destination,
      otpGeneration.type,
      otpGeneration.reason,
      otpGeneration.expireAt,
      hashedOtp,
    );
    await this.otpRepository.save(otpRecord);

    return otp;
  }

  async verify(verification: OtpVerification): Promise<OTPVerificationResult> {
    const hashedOtp = this.createSHA256Hash(verification.otp);
    const otpRecord = await this.getOtp(verification, hashedOtp);
    const destination = verification.mobile ?? verification.email;

    otpRecord.verify(destination);
    otpRecord.markAsUsed();
    await this.otpRepository.save(otpRecord);

    return {
      userId: otpRecord.userId,
    };
  }

  private async getOtp(verification: OtpVerification, hashedOtp: string) {
    const otpRecord = await this.otpRepository.findOne({
      type: verification.type,
      reason: verification.reason,
      otp: hashedOtp,
    });
    if (!otpRecord) {
      throw new OtpNotFoundException(`The OTP not found for given criteria, ${JSON.stringify(verification)}`);
    }

    return otpRecord;
  }

  private async generateUniqueOTP(type: OTPType): Promise<string> {
    const length = type === OTPType.CODE ? 6 : 100;
    const mappedType = type === OTPType.CODE ? 'memory-numeric' : 'url-safe';
    const otp = randomStringSync({ length: length, type: mappedType });

    if (type === OTPType.TOKEN) {
      const exists = await this.otpRepository.exists(otp);
      if (exists) {
        return this.generateUniqueOTP(type);
      }
    }

    return otp;
  }

  private createSHA256Hash(otp: string): string {
    const hash = createHash('sha256');
    hash.update(otp);
    return hash.digest('hex');
  }
}

import { ToLowerCase } from '@repo/decorator';
import { IsNotUUID } from '@repo/validator/is-not-uuid.validator';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { IsIdentifier } from '@repo/validator/is-identifier.validator';
import { Email, Mobile } from '@repo/types/common.types';
import { SendOtp } from '../../../application/services/auth.service';
import { OTPType } from '../../../domain/entities';

export class OtpGenerationDto {
  @IsNotEmpty()
  @IsEnum(OTPType)
  type!: OTPType;

  @IsNotEmpty()
  @IsString()
  @IsNotUUID()
  @ToLowerCase()
  @IsIdentifier()
  identifier!: Email | Mobile;

  toSendOtp(): SendOtp {
    return new SendOtp(this.identifier, this.type);
  }
}

import { ToLowerCase } from '@repo/decorator';
import { IsStrongPassword } from '@repo/validator/is-strong-password.validator';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsString } from 'class-validator';
import { IsIdentifier } from '@repo/validator/is-identifier.validator';
import { IsNotUUID } from '@repo/validator/is-not-uuid.validator';
import { Email, Mobile } from '@repo/types/common.types';
import {
  AuthenticateByThirdPartyData,
  SignupByOtpData,
  SignupByPasswordData,
} from '../../../application/services/auth.service';
import { AuthProviderType } from '../../../application/usecases/third-parties/auth-provider';

export class SignupByOtpDto {
  @IsNotEmpty()
  @IsString()
  @IsNotUUID()
  @ToLowerCase()
  @IsIdentifier()
  identifier!: string;

  toSignupByOtpData(): SignupByOtpData {
    return { identifier: this.identifier };
  }
}

export class AuthenticateByThirdPartyDto {
  @IsNotEmpty()
  @IsString()
  token!: string;

  toAuthenticateByThirdPartyData(): AuthenticateByThirdPartyData {
    return {
      data: { token: this.token },
      provider: AuthProviderType.GOOGLE,
    };
  }
}

export class IdentifierPasswordSignupDto {
  @IsNotEmpty()
  @Type(() => String)
  @IsNotUUID()
  @ToLowerCase()
  @IsIdentifier()
  identifier!: Email | Mobile;

  @IsNotEmpty()
  @IsString()
  @Type(() => String)
  @IsStrongPassword()
  password!: string;

  toSignupByPasswordData(): SignupByPasswordData {
    return {
      identifier: this.identifier,
      password: this.password,
    };
  }
}

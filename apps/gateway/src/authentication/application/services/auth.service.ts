import { Injectable } from '@nestjs/common';
import { isEmail } from 'class-validator';
import { Email, Mobile, UserId, Username } from '@repo/types/common.types';
import { OTPType } from '../../domain/entities';
import { ImpersonationCommand } from '../usecases/impersonation/impersonation.command';
import { ImpersonationUsecase } from '../usecases/impersonation/impersonation.usecase';
import { RefreshTokenCommand } from '../usecases/refresh-token/refresh-token.command';
import { RefreshTokenUsecase } from '../usecases/refresh-token/refresh-token.usecase';
import { RequestResetPasswordCommand } from '../usecases/request-reset-password/request-reset-password.command';
import { RequestResetPasswordUsecase } from '../usecases/request-reset-password/request-reset-password.usecase';
import { ResetPasswordCommand } from '../usecases/reset-password/reset-password.command';
import { ResetPasswordUsecase } from '../usecases/reset-password/reset-password.usecase';
import { RevokeTokenCommand } from '../usecases/revoke-token/revoke-token.command';
import { RevokeTokenUsecase } from '../usecases/revoke-token/revoke-token.usecase';
import { SendOtpCommand } from '../usecases/send-otp/send-otp.command';
import { SendOtpUsecase } from '../usecases/send-otp/send-otp.usecase';
import { SigninByOtpCommand } from '../usecases/signin-by-otp/signin-by-otp';
import { SigninByOtpUsecase } from '../usecases/signin-by-otp/signin-by-otp.usecase';
import { SigninByPasswordCommand } from '../usecases/signin-by-password/signin-by-password';
import { SigninByPasswordUsecase } from '../usecases/signin-by-password/signin-by-password.usecase';
import { SignupByOtpCommand } from '../usecases/signup-by-otp/signup-by-otp.command';
import { SignupByOtpUsecase } from '../usecases/signup-by-otp/signup-by-otp.usecase';
import { SignupByPasswordCommand } from '../usecases/signup-by-password/signup-by-password.command';
import { SignupByPasswordUsecase } from '../usecases/signup-by-password/signup-by-password.usecase';
import { Auth, AuthProviderType } from '../usecases/third-parties/auth-provider';
import { SigninByThirdPartyCommand } from '../usecases/third-parties/signin-by-third-party/signin-by-third-party.command';
import { SigninByThirdPartyUsecase } from '../usecases/third-parties/signin-by-third-party/signin-by-third-party.usecase';
import { SignupByThirdPartyCommand } from '../usecases/third-parties/signup-by-third-party/signup-by-third-party.command';
import { SignupByThirdPartyUsecase } from '../usecases/third-parties/signup-by-third-party/signup-by-third-party.usecase';
import { VerifyCommand } from '../usecases/verify/verify.command';
import { VerifyUsecase } from '../usecases/verify/verify.usecase';
import { RefreshTokenData, RevokeTokenOption, Token } from './jwt-token.service';
import { OtpVerification } from './otp.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly requestResetPasswordUsecase: RequestResetPasswordUsecase,
    private readonly signupByThirdPartyUsecase: SignupByThirdPartyUsecase,
    private readonly signinByThirdPartyUsecase: SigninByThirdPartyUsecase,
    private readonly signinByPasswordUsecase: SigninByPasswordUsecase,
    private readonly signupByPasswordUsecase: SignupByPasswordUsecase,
    private readonly impersonationUsecase: ImpersonationUsecase,
    private readonly resetPasswordUsecase: ResetPasswordUsecase,
    private readonly refreshTokenUsecase: RefreshTokenUsecase,
    private readonly signinByOtpUsecase: SigninByOtpUsecase,
    private readonly revokeTokenUsecase: RevokeTokenUsecase,
    private readonly signupByOtpUsecase: SignupByOtpUsecase,
    private readonly sendOtpUsecase: SendOtpUsecase,
    private readonly verifyUsecase: VerifyUsecase,
  ) {}

  async signupByThirdParty(data: AuthenticateByThirdPartyData): Promise<Token> {
    return await this.signupByThirdPartyUsecase.execute(SignupByThirdPartyCommand.create(data));
  }

  async signinByThirdParty(data: AuthenticateByThirdPartyData): Promise<Token> {
    return await this.signinByThirdPartyUsecase.execute(SigninByThirdPartyCommand.create(data));
  }

  async revokeToken(options: RevokeTokenOption): Promise<void> {
    await this.revokeTokenUsecase.execute(RevokeTokenCommand.create(options));
  }

  async signinByPassword(data: SigninByPasswordData): Promise<Token> {
    return await this.signinByPasswordUsecase.execute(SigninByPasswordCommand.create(data));
  }

  async signinByOtp(data: SigninByOtpData): Promise<Token> {
    return await this.signinByOtpUsecase.execute(SigninByOtpCommand.create(data));
  }

  async impersonation(data: ImpersonationData): Promise<Token> {
    return await this.impersonationUsecase.execute(ImpersonationCommand.create(data));
  }

  async signupByOtp(data: SignupByOtpData): Promise<void> {
    await this.signupByOtpUsecase.execute(SignupByOtpCommand.create(data));
  }

  async signupByPassword(data: SignupByPasswordData): Promise<void> {
    await this.signupByPasswordUsecase.execute(SignupByPasswordCommand.create(data));
  }

  async sendOtp(data: SendOtp): Promise<void> {
    await this.sendOtpUsecase.execute(SendOtpCommand.create(data));
  }

  async requestResetPassword(identifier: Email | Mobile): Promise<void> {
    await this.requestResetPasswordUsecase.execute(
      RequestResetPasswordCommand.create({
        identifier,
      }),
    );
  }

  async resetPassword(otpVerification: OtpVerification, password: string): Promise<void> {
    await this.resetPasswordUsecase.execute(
      ResetPasswordCommand.create({
        otpData: otpVerification,
        password,
      }),
    );
  }

  async verify(data: VerifyData): Promise<Token> {
    return await this.verifyUsecase.execute(VerifyCommand.create(data));
  }

  async refreshToken(data: RefreshTokenData): Promise<Token> {
    return await this.refreshTokenUsecase.execute(RefreshTokenCommand.create(data));
  }
}

export class SendOtp {
  constructor(
    readonly identifier: Email | Mobile,
    readonly type: OTPType,
  ) {}

  isEmail(): boolean {
    return isEmail(this.identifier);
  }
}

export class VerifyData {
  readonly otp!: string;
  readonly type!: OTPType;
  readonly identifier!: Email | Mobile;
}

export class SigninByOtpData {
  readonly otp!: string;
  readonly type!: OTPType;
  readonly identifier!: Email | Mobile;
}

export class ImpersonationData {
  readonly identifier!: Email | Mobile | UserId | Username;
}

export class SigninByPasswordData {
  readonly password!: string;
  readonly identifier!: Email | Mobile;
}

export class SignupByPasswordData {
  readonly password!: string;
  readonly identifier!: Email | Mobile;
}

export class SignupByOtpData {
  readonly identifier!: Email | Mobile;
}

export class AuthenticateByThirdPartyData {
  readonly provider!: AuthProviderType;
  readonly data!: Auth;
}

export enum SigninMethod {
  PASSWORD = 'password',
  OTP = 'otp',
  CALL = 'call',
}

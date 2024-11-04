import { Module, Provider } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Configuration } from '@repo/config';
import { IsStrongPasswordConstraint } from '@repo/validator/is-strong-password.validator';
import { CacheServiceModule } from '../../common/cache/cache.module';
import { ProfileModule } from '../../users/profiles/infrastructure/profiles.module';
import { RolesModule } from '../../users/roles/infrastructure/roles.module';
import { AuthService } from '../application/services/auth.service';
import { AuthenticationNotifier } from '../application/services/authentication.notifier';
import { JwtTokenService } from '../application/services/jwt-token.service';
import { OtpService } from '../application/services/otp.service';
import { ImpersonationUsecase } from '../application/usecases/impersonation/impersonation.usecase';
import { RefreshTokenUsecase } from '../application/usecases/refresh-token/refresh-token.usecase';
import { RequestResetPasswordUsecase } from '../application/usecases/request-reset-password/request-reset-password.usecase';
import { ResetPasswordUsecase } from '../application/usecases/reset-password/reset-password.usecase';
import { RevokeTokenUsecase } from '../application/usecases/revoke-token/revoke-token.usecase';
import { SendOtpUsecase } from '../application/usecases/send-otp/send-otp.usecase';
import { SigninByOtpUsecase } from '../application/usecases/signin-by-otp/signin-by-otp.usecase';
import { SigninByPasswordUsecase } from '../application/usecases/signin-by-password/signin-by-password.usecase';
import { SignupByOtpUsecase } from '../application/usecases/signup-by-otp/signup-by-otp.usecase';
import { SignupByPasswordUsecase } from '../application/usecases/signup-by-password/signup-by-password.usecase';
import { AuthProvider } from '../application/usecases/third-parties/auth-provider';
import { AuthProviderManager } from '../application/usecases/third-parties/auth-provider-manager';
import { SigninByThirdPartyUsecase } from '../application/usecases/third-parties/signin-by-third-party/signin-by-third-party.usecase';
import { SignupByThirdPartyUsecase } from '../application/usecases/third-parties/signup-by-third-party/signup-by-third-party.usecase';
import { VerifyUsecase } from '../application/usecases/verify/verify.usecase';
import { OTP_REPOSITORY_TOKEN } from '../domain/repositories';
import { TypeormOTPEntity } from './database/entities';
import { TypeOrmOTPRepository } from './database/repositories';
import { GoogleAuthProvider } from './providers/google';
import { AuthenticationController } from './web';
import { AuthorizationGuard, CheckPermissionGuard, IsUserEnableGuard } from './web/guards';
import { CheckSignupGuard } from './web/guards/check-signup.guard';

const authProviderManager: Provider = {
  provide: AuthProviderManager,
  inject: [Configuration],
  useFactory: (configuration: Configuration) => {
    const authProviders: AuthProvider[] = [new GoogleAuthProvider(configuration)];

    return new AuthProviderManager(authProviders);
  },
};

const otpRepository: Provider = {
  provide: OTP_REPOSITORY_TOKEN,
  useClass: TypeOrmOTPRepository,
};

@Module({
  imports: [TypeOrmModule.forFeature([TypeormOTPEntity]), CacheServiceModule, ProfileModule, RolesModule],
  controllers: [AuthenticationController],
  providers: [
    authProviderManager,
    otpRepository,
    AuthService,
    OtpService,
    AuthenticationNotifier,
    JwtTokenService,
    AuthorizationGuard,
    CheckPermissionGuard,
    IsUserEnableGuard,
    CheckSignupGuard,
    RequestResetPasswordUsecase,
    ResetPasswordUsecase,
    SendOtpUsecase,
    VerifyUsecase,
    SigninByOtpUsecase,
    SignupByOtpUsecase,
    SigninByPasswordUsecase,
    SignupByPasswordUsecase,
    ImpersonationUsecase,
    SignupByThirdPartyUsecase,
    SigninByThirdPartyUsecase,
    RefreshTokenUsecase,
    RevokeTokenUsecase,
    {
      provide: IsStrongPasswordConstraint,
      inject: [Configuration],
      useFactory: (config: Configuration) => new IsStrongPasswordConstraint(config.authentication.passwordRegEx),
    },
  ],
  exports: [OtpService, AuthService, JwtTokenService],
})
export class AuthenticationModule {}

import { Module, Provider } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CacheServiceModule } from '../../common/cache/cache.module';
import { Configuration } from '../../common/config';
import { IsStrongPasswordConstraint } from '../../common/is-strong-password.validator';
import { UsersService } from '../../users/profiles/application/users.service';
import { ProfileModule } from '../../users/profiles/infrastructure/profiles.module';
import { RolesModule } from '../../users/roles/infrastructure/roles.module';
import { AuthProviderManager, AuthService, AuthenticationNotifier, JwtTokenService, OtpService } from '../application/services';
import { AuthProvider } from '../application/services/auth-provider';
import { RequestResetPasswordUsecase } from '../application/usecases/request-reset-password/request-reset-password.usecase';
import { ResetPasswordUsecase } from '../application/usecases/reset-password/reset-password.usecase';
import { SendOtpUsecase } from '../application/usecases/send-otp/send-otp.usecase';
import { SigninByOtpUsecase } from '../application/usecases/signin-by-otp/signin-by-otp.usecase';
import { SignupByOtpUsecase } from '../application/usecases/signup-by-otp/signup-by-otp.usecase';
import { VerifyUsecase } from '../application/usecases/verify/verify.usecase';
import { OTP_REPOSITORY_TOKEN } from '../domain/repositories';
import { TypeormOTPEntity } from './database/entities';
import { TypeOrmOTPRepository } from './database/repositories';
import { GoogleAuthProvider } from './providers/google';
import { AuthenticationController } from './web';
import { AuthorizationGuard, CheckPermissionGuard, IsUserEnableGuard } from './web/guards';
import { SigninByPasswordUsecase } from '../application/usecases/signin-by-password/signin-by-password.usecase';
import { SignupByPasswordUsecase } from '../application/usecases/signup-by-password/signup-by-password.usecase';
import { ImpersonationUsecase } from '../application/usecases/impersonation/impersonation.usecase';

const authProviderManager: Provider = {
  provide: AuthProviderManager,
  inject: [AuthenticationNotifier, Configuration, UsersService, OtpService],
  useFactory: (
    configuration: Configuration,
    usersService: UsersService,
  ) => {
    const authProviders: AuthProvider[] = [
      new GoogleAuthProvider(configuration, usersService),
    ];

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
    RequestResetPasswordUsecase,
    ResetPasswordUsecase,
    SendOtpUsecase,
    VerifyUsecase,
    SigninByOtpUsecase,
    SignupByOtpUsecase,
    SigninByPasswordUsecase,
    SignupByPasswordUsecase,
    ImpersonationUsecase,
    {
      provide: IsStrongPasswordConstraint,
      inject: [Configuration],
      useFactory: (config: Configuration) => new IsStrongPasswordConstraint(config),
    },
  ],
  exports: [OtpService, AuthService, JwtTokenService],
})
export class AuthenticationModule {}

import { Injectable, Logger } from '@nestjs/common';
import { publish } from '@repo/rabbit/rabbit-mq.service';
import { isEmail, isPhoneNumber } from 'class-validator';
import { UsersService } from '../../../../users/profiles/application/users.service';
import { UserEntity } from '../../../../users/profiles/domain/entities/user.entity';
import { RolesService } from '../../../../users/roles/application/roles.service';
import { Permission } from '../../../../users/roles/domain/entities/role.entity';
import { AUTHENTICATION_EXCHANGE_NAME } from '../../../domain/constants';
import { OTPReason } from '../../../domain/entities';
import { AuthenticationEvents, UserLoggedInEvent, UserVerifiedEvent } from '../../../domain/events';
import { InvalidCredentialException, YourAccountIsBlockedException } from '../../exceptions';
import { AccessType, JwtTokenService, Token } from '../../services/jwt-token.service';
import { OtpService, OtpVerification } from '../../services/otp.service';
import { SigninByOtpCommand } from './signin-by-otp';

@Injectable()
export class SigninByOtpUsecase {
  private readonly logger = new Logger(SigninByOtpUsecase.name);

  constructor(
    private readonly tokenService: JwtTokenService,
    private readonly usersService: UsersService,
    private readonly rolesService: RolesService,
    private readonly otpService: OtpService,
  ) {}

  async execute(command: SigninByOtpCommand): Promise<Token> {
    const email = isEmail(command.identifier) ? command.identifier : undefined;
    const mobile = isPhoneNumber(command.identifier) ? command.identifier : undefined;
    if (!mobile && !email) {
      this.logger.verbose(`to signin by OTP, we need email or mobile ${command.identifier}`);
      throw new InvalidCredentialException(`to signin by OTP, we need email or mobile ${command.identifier}`);
    }

    const verifyResult = await this.otpService.verify(
      new OtpVerification(command.otp, command.type, OTPReason.LOGIN, email, mobile),
    );

    const user = await this.usersService.findOneByIdentifier(verifyResult.userId);
    if (!user) {
      this.logger.verbose(`user not found, ${command.identifier}`);
      throw new InvalidCredentialException(`user not found, ${command.identifier}`);
    }

    if (user.isBlocked) {
      throw new YourAccountIsBlockedException();
    }

    if (!user.isVerified()) {
      if (mobile) {
        user.isMobileVerified = true;
      }

      if (email) {
        user.isEmailVerified = true;
      }

      publish(AUTHENTICATION_EXCHANGE_NAME, AuthenticationEvents.USER_VERIFIED, new UserVerifiedEvent(user));
    }

    publish(AUTHENTICATION_EXCHANGE_NAME, AuthenticationEvents.USER_LOGGED_IN, new UserLoggedInEvent(user));

    return await this.generateToken(user);
  }

  private async generateToken(user: UserEntity): Promise<Token> {
    const permissions = await this.findUserPermissions(user);
    return await this.tokenService.generate({
      accessType: AccessType.VERIFIED_USER,
      email: user.email,
      mobile: user.mobile,
      isEmailVerified: user.isEmailVerified,
      isMobileVerified: user.isMobileVerified,
      userId: user.id,
      isBlocked: user.isBlocked,
      permissions,
    });
  }

  private async findUserPermissions(user: UserEntity): Promise<Permission[]> {
    const permissions: Permission[] = [];
    if (!user.hasRole()) {
      return permissions;
    }

    try {
      const role = await this.rolesService.findOneById(user.roleId!);
      permissions.push(...role.permissions);
    } catch (error) {
      this.logger.error(error);
    }
    return permissions;
  }
}

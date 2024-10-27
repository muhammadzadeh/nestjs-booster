import { Injectable, Logger } from '@nestjs/common';
import { IllegalStateException } from '@repo/exception';
import { publish } from '@repo/rabbit/rabbit-mq.service';
import { UsersService } from '../../../../../users/profiles/application/users.service';
import { UserEntity } from '../../../../../users/profiles/domain/entities/user.entity';
import { RolesService } from '../../../../../users/roles/application/roles.service';
import { Permission } from '../../../../../users/roles/domain/entities/role.entity';
import { AUTHENTICATION_EXCHANGE_NAME } from '../../../../domain/constants';
import { AuthenticationEvents, UserLoggedInEvent, UserVerifiedEvent } from '../../../../domain/events';
import { UserAlreadyRegisteredException } from '../../../exceptions';
import { AccessType, JwtTokenService, Token } from '../../../services/jwt-token.service';
import { AuthProviderManager } from '../auth-provider-manager';
import { SignupByThirdPartyCommand } from './signup-by-third-party.command';

@Injectable()
export class SignupByThirdPartyUsecase {
  private readonly logger = new Logger(SignupByThirdPartyUsecase.name);

  constructor(
    private readonly providerManager: AuthProviderManager,
    private readonly tokenService: JwtTokenService,
    private readonly usersService: UsersService,
    private readonly rolesService: RolesService,
  ) {}

  async execute(command: SignupByThirdPartyCommand): Promise<Token> {
    const thirdPartyResult = await this.providerManager.authenticate(command.data, command.provider);
    if (!thirdPartyResult.email) {
      throw new IllegalStateException('Email is missing in the response of OAuth2 server');
    }

    const user = await this.usersService.findOneByIdentifier(thirdPartyResult.email);
    if (user) {
      throw new UserAlreadyRegisteredException(`User with identifier ${thirdPartyResult.email} already exists.`);
    }

    const createdUser = await this.usersService.create({
      email: thirdPartyResult.email,
      isEmailVerified: true,
      firstName: thirdPartyResult.firstName,
      lastName: thirdPartyResult.lastName,
      avatar: thirdPartyResult.avatar,
    });

    publish(AUTHENTICATION_EXCHANGE_NAME, AuthenticationEvents.USER_VERIFIED, new UserVerifiedEvent(createdUser));

    publish(AUTHENTICATION_EXCHANGE_NAME, AuthenticationEvents.USER_LOGGED_IN, new UserLoggedInEvent(createdUser));

    return await this.generateToken(createdUser);
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

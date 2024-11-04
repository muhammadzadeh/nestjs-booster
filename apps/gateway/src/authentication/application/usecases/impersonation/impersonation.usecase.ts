import { Injectable, Logger } from '@nestjs/common';
import { Configuration } from '@repo/config';
import { UsersService } from '../../../../users/profiles/application/users.service';
import { UserEntity } from '../../../../users/profiles/domain/entities/user.entity';
import { RolesService } from '../../../../users/roles/application/roles.service';
import { Permission } from '../../../../users/roles/domain/entities/role.entity';
import { InvalidCredentialException } from '../../exceptions';
import { AccessType, JwtTokenService, Token } from '../../services/jwt-token.service';
import { ImpersonationCommand } from './impersonation.command';

@Injectable()
export class ImpersonationUsecase {
  private readonly logger = new Logger(ImpersonationUsecase.name);

  constructor(
    private readonly tokenService: JwtTokenService,
    private readonly configuration: Configuration,
    private readonly usersService: UsersService,
    private readonly rolesService: RolesService,
  ) {}

  async execute(command: ImpersonationCommand): Promise<Token> {
    const user = await this.usersService.findOneByIdentifier(command.identifier);
    if (!user) {
      this.logger.verbose(`user not found, ${command.identifier}`);
      throw new InvalidCredentialException(`user not found, ${command.identifier}`);
    }

    if (!this.configuration.authentication.allowImpersonation) {
      throw new InvalidCredentialException(`Impersonation is disabled!`);
    }

    return await this.generateToken(user);
  }

  private async generateToken(user: UserEntity): Promise<Token> {
    const permissions = await this.findUserPermissions(user);
    return await this.tokenService.generate({
      accessType: user.isVerified() ? AccessType.VERIFIED_USER : AccessType.UNVERIFIED_USER,
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

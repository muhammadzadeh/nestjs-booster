import { Inject, Logger } from '@nestjs/common';
import { Configuration } from '@repo/config';
import { BaseSeeder, DatabaseSeeder } from '../../../common/database';
import { randomStringAsync } from '../../../common/string';
import { RolesService } from '../../roles/application/roles.service';
import { Permission } from '../../roles/domain/entities/role.entity';
import { UserEntity } from '../domain/entities/user.entity';
import { USERS_REPOSITORY_TOKEN, UsersRepository } from '../domain/repositories/users.repository';

@DatabaseSeeder()
export class DefaultUserSeeder extends BaseSeeder {
  private logger = new Logger(DefaultUserSeeder.name);

  static readonly description = 'This script will seed default user into db.';

  constructor(
    @Inject(USERS_REPOSITORY_TOKEN) private readonly usersRepository: UsersRepository,
    private readonly rolesService: RolesService,
    private readonly config: Configuration,
  ) {
    super();
  }

  async run(): Promise<void> {
    const isUserExists = await this.usersRepository.exists({});
    if (isUserExists) {
      return;
    }

    const { items: roles } = await this.rolesService.findAll({
      permissions: [Permission.MANAGE_EVERY_THINGS],
    });

    if (!roles.length) {
      this.logger.debug('Default role does not exists! check role seeder!');
      return;
    }
    const defaultUser = this.config.defaultUser;
    const defaultMobile = defaultUser?.mobile ?? null;
    const defaultEmail = defaultUser?.email ?? (await this.generateDefaultEmail());
    const defaultPassword = defaultUser?.password ?? (await this.generateDefaultPassword());
    const user = new UserEntity('Super', 'Admin', defaultEmail, defaultMobile);
    user.updatePassword(defaultPassword);
    user.updateRole(roles[0]!.id);

    if (defaultEmail) {
      user.markEmailAsVerified();
    }

    if (defaultMobile) {
      user.markMobileAsVerified();
    }

    await this.usersRepository.save(user);

    if (!this.config.defaultUser) {
      this.logger.debug('Default user config is not provided, Generating Random data!');
      this.logger.verbose(`Default credentials is: \n email: ${defaultEmail} \n password: ${defaultPassword}`);
    }
  }

  private async generateDefaultPassword(): Promise<string> {
    return randomStringAsync({ length: 21, type: 'alphanumeric' });
  }

  private async generateDefaultEmail(): Promise<string> {
    const firstPart = await randomStringAsync({ length: 13, type: 'alphanumeric' });
    return `${firstPart}@admin.com`.toLowerCase();
  }
}

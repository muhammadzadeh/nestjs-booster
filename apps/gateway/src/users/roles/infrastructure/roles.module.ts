import { Module, Provider } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RolesService } from '../application/roles.service';
import { ROLES_REPOSITORY_TOKEN } from '../domain/repositories/roles.repository';
import { TypeormRoleEntity } from './database/entities/typeorm-role.entity';
import { TypeormRolesRepository } from './database/repositories/typeorm-roles.repository';
import { RoleController } from './web/role.controller';
import { DefaultRolesSeeder } from '../application/default-role.seeder';

const rolesRepository: Provider = {
  provide: ROLES_REPOSITORY_TOKEN,
  useClass: TypeormRolesRepository,
};

@Module({
  imports: [TypeOrmModule.forFeature([TypeormRoleEntity])],
  controllers: [RoleController],
  providers: [rolesRepository, RolesService, DefaultRolesSeeder],
  exports: [RolesService],
})
export class RolesModule {}

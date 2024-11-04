import { applyDecorators, Controller, SetMetadata } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { ControllerType, MetaKey, RequestScope } from '@repo/types/common.enums';
import { TENANT_CONFIG } from '@repo/types/constants';

export const AdminController = (path?: string): ClassDecorator =>
  applyDecorators(
    Controller(TENANT_CONFIG.ADMIN.route + (path ?? '')),
    SetMetadata(MetaKey.CONTROLLER_TYPE, ControllerType.ADMIN),
    SetMetadata(MetaKey.REQUEST_SCOPE, RequestScope.ADMIN),
    ApiBearerAuth(),
  );

export const UserController = (path?: string): ClassDecorator =>
  applyDecorators(
    Controller(TENANT_CONFIG.USER.route + (path ?? '')),
    SetMetadata(MetaKey.CONTROLLER_TYPE, ControllerType.USER),
    SetMetadata(MetaKey.REQUEST_SCOPE, RequestScope.USER),
    ApiBearerAuth(),
  );

export const CommonController = (path?: string): ClassDecorator =>
  applyDecorators(
    Controller(TENANT_CONFIG.COMMON.route + (path ?? '')),
    SetMetadata(MetaKey.CONTROLLER_TYPE, ControllerType.COMMON),
    SetMetadata(MetaKey.REQUEST_SCOPE, RequestScope.USER),
    ApiBearerAuth(),
  );

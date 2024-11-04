import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthenticationMetaKey, CURRENT_USER_KEY, CurrentUser } from '../decorators';
import { Permission } from '../../../../users/roles/domain/entities/role.entity';

@Injectable()
export class CheckPermissionGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const controller = context.getClass();
    const route = context.getHandler();
    const user: CurrentUser = context.switchToHttp().getRequest()[CURRENT_USER_KEY];
    if (!user) {
      return true;
    }

    const routeMetadata = this.reflector.getAllAndOverride<{ permissions: Permission[] } | undefined>(
      AuthenticationMetaKey.REQUIRED_PERMISSION,
      [route, controller],
    );

    if (!routeMetadata) {
      return true;
    }

    return (
      user.permissions?.includes(Permission.MANAGE_EVERY_THINGS) ||
      !(
        routeMetadata.permissions?.length > 0 &&
        !routeMetadata.permissions?.some((p: Permission) => user.permissions?.includes(p))
      )
    );
  }
}

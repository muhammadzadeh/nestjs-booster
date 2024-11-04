import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthenticationMetaKey, CURRENT_USER_KEY, CurrentUser } from '../decorators';
import { YourAccountIsBlockedException } from '../../../application/exceptions';

@Injectable()
export class IsUserEnableGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const handler = context.getHandler();
    const ignoreIsEnableGuard = this.reflector.get<boolean | undefined>(
      AuthenticationMetaKey.IGNORE_CHECK_IS_ENABLE_GUARD,
      handler,
    );

    if (ignoreIsEnableGuard) {
      return true;
    }

    const user: CurrentUser = context.switchToHttp().getRequest()[CURRENT_USER_KEY];
    if (!user) {
      return true;
    }

    if (user.isBlocked) {
      throw new YourAccountIsBlockedException();
    }

    return true;
  }
}

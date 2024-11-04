import { CanActivate, ExecutionContext, Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ExtractJwt } from 'passport-jwt';
import { JwtTokenService } from '../../../application/services/jwt-token.service';
import { AuthenticationMetaKey, CURRENT_USER_KEY, CurrentUser } from '../decorators';

@Injectable()
export class AuthorizationGuard implements CanActivate {
  private readonly logger = new Logger(AuthorizationGuard.name);

  private readonly ignoredControllers = new Set(['HealthController']);

  constructor(
    private readonly jwtTokenService: JwtTokenService,
    private readonly reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const controller = context.getClass();
    if (this.ignoredControllers.has(controller.name)) {
      return true;
    }

    const route = context.getHandler();
    const ignoreRoute = this.reflector.getAllAndOverride<boolean | undefined>(
      AuthenticationMetaKey.IGNORE_AUTHORIZATION_GUARD,
      [controller, route],
    );
    if (ignoreRoute) {
      this.logger.verbose(`Ignoring ${route.name} at ${controller.name}.`);
      return true;
    }

    const allowUnauthorizedRequest = this.reflector.getAllAndOverride<boolean | undefined>(
      AuthenticationMetaKey.ALLOW_UN_AUTHORIZED_REQUESTS,
      [controller, route],
    );

    const accessToken = ExtractJwt.fromAuthHeaderAsBearerToken()(context.switchToHttp().getRequest())!;

    if (!accessToken && !allowUnauthorizedRequest) {
      throw new UnauthorizedException();
    }

    if (!accessToken && allowUnauthorizedRequest) {
      return true;
    }

    try {
      const payload = await this.jwtTokenService.verify(accessToken);
      const user: CurrentUser = {
        id: payload.userId,
        email: payload.email,
        mobile: payload.mobile,
        isEmailVerified: payload.isEmailVerified,
        isMobileVerified: payload.isMobileVerified,
        permissions: payload.permissions,
        isBlocked: payload.isBlocked,
      };
      context.switchToHttp().getRequest()[CURRENT_USER_KEY] = user;
    } catch (error) {
      this.logger.error(error);
      if (!allowUnauthorizedRequest) {
        throw new UnauthorizedException();
      }
    }

    return true;
  }
}

import { CanActivate, ExecutionContext, Inject, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { CAPTCHA_PROVIDER_TOKEN, CaptchaProvider } from '../../application/captcha-provider';
import { CAPTCHA_TOKEN_HEADER_KEY, CaptchaMetaKey } from './constants';

@Injectable()
export class CaptchaGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    @Inject(CAPTCHA_PROVIDER_TOKEN)
    private readonly captchaProvider: CaptchaProvider,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const controller = context.getClass();
    const route = context.getHandler();
    const requiredCaptcha = this.reflector.getAllAndOverride<boolean | undefined>(CaptchaMetaKey.CAPTCHA, [
      controller,
      route,
    ]);

    if (!requiredCaptcha) {
      return true;
    }

    const headers = context.switchToHttp().getRequest()['headers'];
    const captchaToken = headers[CAPTCHA_TOKEN_HEADER_KEY];

    return this.captchaProvider.validate(captchaToken);
  }
}

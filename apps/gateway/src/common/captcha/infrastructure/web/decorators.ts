import { applyDecorators, SetMetadata } from '@nestjs/common';
import { ApiHeader } from '@nestjs/swagger';
import { CAPTCHA_TOKEN_HEADER_KEY, CaptchaMetaKey } from './constants';

export const Captcha = (): MethodDecorator & ClassDecorator =>
  applyDecorators(SetMetadata(CaptchaMetaKey.CAPTCHA, true), ApiHeader({ name: CAPTCHA_TOKEN_HEADER_KEY }));

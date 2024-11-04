import { HttpStatus } from '@nestjs/common';
import { BaseHttpException } from '@repo/exception/base.exception';
import { ErrorCode } from '@repo/types/error-code.enum';

export const CAPTCHA_PROVIDER_TOKEN = Symbol('Captcha');

export interface CaptchaProvider {
  validate(token: string): Promise<boolean>;
  getName(): string;
}

export class InvalidRecaptchaException extends BaseHttpException {
  readonly status: HttpStatus = HttpStatus.FORBIDDEN;
  readonly useOriginalMessage?: boolean;
  readonly code: ErrorCode = ErrorCode.INVALID_CAPTCHA_TOKEN;
}

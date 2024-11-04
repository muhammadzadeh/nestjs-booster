import { HttpStatus } from '@nestjs/common';
import { ErrorCode } from '@repo/types/error-code.enum';
import { BaseHttpException } from './base.exception';

export class IllegalStateException extends BaseHttpException {
  readonly code = ErrorCode.ILLEGAL_STATE;
  readonly status: HttpStatus = HttpStatus.INTERNAL_SERVER_ERROR;
  readonly useOriginalMessage?: boolean = false;
}

import { HttpStatus, PayloadTooLargeException } from '@nestjs/common';
import { ExceptionResponse, Status } from '../exception.response';
import { ExceptionMapper } from './exception-mapper';

export class PayloadTooLargeExceptionMapper implements ExceptionMapper {
  map(exception: PayloadTooLargeException): ExceptionResponse {
    return {
      message: exception.message,
      status: Status.FAILURE,
      statusCode: HttpStatus.PAYLOAD_TOO_LARGE,
      errorCode: 'PAYLOAD_TOO_LARGE',
    };
  }
}

import { HttpStatus, UnauthorizedException } from '@nestjs/common';
import { ExceptionResponse, Status } from '../exception.response';
import { ExceptionMapper } from './exception-mapper';

export class UnauthorizedExceptionMapper implements ExceptionMapper {
  map(exception: UnauthorizedException): ExceptionResponse {
    return {
      message: exception.message,
      status: Status.FAILURE,
      statusCode: HttpStatus.UNAUTHORIZED,
      errorCode: 'NOT_AUTHORIZED',
    };
  }
}

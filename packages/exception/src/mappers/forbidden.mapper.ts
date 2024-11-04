import { ForbiddenException, HttpStatus } from '@nestjs/common';
import { ExceptionResponse, Status } from '../exception.response';
import { ExceptionMapper } from './exception-mapper';

export class ForbiddenExceptionMapper implements ExceptionMapper {
  map(exception: ForbiddenException): ExceptionResponse {
    return {
      message: exception.message,
      status: Status.FAILURE,
      statusCode: HttpStatus.FORBIDDEN,
      errorCode: 'FORBIDDEN',
    };
  }
}

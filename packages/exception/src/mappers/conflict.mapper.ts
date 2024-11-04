import { ConflictException, HttpStatus } from '@nestjs/common';
import { ExceptionResponse, Status } from '../exception.response';
import { ExceptionMapper } from './exception-mapper';

export class ConflictExceptionMapper implements ExceptionMapper {
  map(exception: ConflictException): ExceptionResponse {
    return {
      message: exception.message,
      status: Status.FAILURE,
      statusCode: HttpStatus.CONFLICT,
      errorCode: 'CONFLICT',
    };
  }
}

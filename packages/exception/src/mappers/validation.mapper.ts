import { HttpStatus } from '@nestjs/common';
import { ExceptionResponse, Status } from '../exception.response';
import { ValidationException } from '../validation.exception';
import { ExceptionMapper } from './exception-mapper';

export class ValidationExceptionMapper implements ExceptionMapper {
  map(exception: ValidationException): ExceptionResponse {
    return {
      message: exception.message,
      status: Status.FAILURE,
      statusCode: HttpStatus.BAD_REQUEST,
      errorCode: 'INVALID_INPUTS',
      errors: exception.getFlatErrors(),
    };
  }
}

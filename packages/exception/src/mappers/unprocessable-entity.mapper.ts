import { HttpStatus, UnprocessableEntityException } from '@nestjs/common';
import { ExceptionResponse, Status } from '../exception.response';
import { ExceptionMapper } from './exception-mapper';

export class UnprocessableEntityExceptionMapper implements ExceptionMapper {
  map(exception: UnprocessableEntityException): ExceptionResponse {
    return {
      message: exception.message,
      status: Status.FAILURE,
      statusCode: HttpStatus.UNPROCESSABLE_ENTITY,
      errorCode: 'UNPROCESSABLE_ENTITY',
    };
  }
}

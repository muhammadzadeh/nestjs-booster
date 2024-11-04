import { BadRequestException, HttpStatus } from '@nestjs/common';
import { ExceptionResponse, Status } from '../exception.response';
import { ExceptionMapper } from './exception-mapper';

export class BadRequestExceptionMapper implements ExceptionMapper {
  constructor() {}

  map(exception: BadRequestException): ExceptionResponse {
    return {
      message: exception.message,
      status: Status.FAILURE,
      statusCode: HttpStatus.BAD_REQUEST,
      errorCode: 'BAD_REQUEST',
    };
  }
}

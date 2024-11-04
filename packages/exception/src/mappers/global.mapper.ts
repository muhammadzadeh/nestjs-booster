import { BaseHttpException } from '../base.exception';
import { ExceptionResponse, Status } from '../exception.response';
import { ExceptionMapper } from './exception-mapper';

export class GlobalExceptionMapper implements ExceptionMapper {
  map(exception: BaseHttpException): ExceptionResponse {
    return {
      message: exception.message,
      status: Status.FAILURE,
      statusCode: exception.status,
      errorCode: exception.code,
    };
  }
}

import { ExceptionResponse } from '../exception.response';

export interface ExceptionMapper {
  map(exception: Error): ExceptionResponse;
}

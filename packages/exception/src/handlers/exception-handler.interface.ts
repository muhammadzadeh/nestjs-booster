import { ArgumentsHost } from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { ExceptionResponse } from '../exception.response';

export interface ExceptionHandler {
  handle(
    error: ExceptionResponse,
    host: ArgumentsHost,
    httpAdapterHost: HttpAdapterHost
  ): any;
}

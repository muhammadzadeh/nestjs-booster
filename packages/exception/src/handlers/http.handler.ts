import { ArgumentsHost, Injectable } from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { ExceptionResponse } from '../exception.response';
import { ExceptionHandler } from './exception-handler.interface';

@Injectable()
export class HttpExceptionHandler implements ExceptionHandler {
  handle(error: ExceptionResponse, host: ArgumentsHost, httpAdapterHost: HttpAdapterHost): void {
    const context = host.switchToHttp();
    const response = context.getResponse();
    const request = context.getRequest();
    const traceId = request['id'];

    httpAdapterHost.httpAdapter.reply(response, { ...error, traceId }, error.statusCode);
  }
}

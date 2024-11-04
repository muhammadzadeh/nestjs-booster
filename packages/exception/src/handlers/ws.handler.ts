import { ArgumentsHost, Injectable } from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { Socket } from 'socket.io';
import { ExceptionResponse } from '../exception.response';
import { ExceptionHandler } from './exception-handler.interface';

@Injectable()
export class WsExceptionHandler implements ExceptionHandler {
  handle(error: ExceptionResponse, host: ArgumentsHost, _httpAdapterHost: HttpAdapterHost): void {
    const client: Socket = host.switchToWs().getClient();
    const traceId = client.id;

    client.emit('exception', { ...error, traceId });
  }
}

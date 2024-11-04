import { ArgumentsHost, Injectable } from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { Observable, throwError } from 'rxjs';
import { ExceptionResponse } from '../exception.response';
import { ExceptionHandler } from './exception-handler.interface';

@Injectable()
export class RpcExceptionHandler implements ExceptionHandler {
  handle(error: ExceptionResponse, _host: ArgumentsHost, _httpAdapterHost: HttpAdapterHost): Observable<any> {
    return throwError(() => error);
  }
}

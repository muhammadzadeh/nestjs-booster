import { ArgumentsHost, ExceptionFilter, Logger, RpcExceptionFilter } from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { Configuration } from '@repo/config';
import { captureException } from '@sentry/node';
import { isNumber, isString } from 'lodash';
import { I18nService } from 'nestjs-i18n';
import { ExceptionResponse, Status } from './exception.response';
import { ExceptionHandler, HttpExceptionHandler, RpcExceptionHandler, WsExceptionHandler } from './handlers';
import { IllegalStateException } from './illegal-state.exception';
import {
  BadRequestExceptionMapper,
  ConflictExceptionMapper,
  ExceptionMapper,
  ForbiddenExceptionMapper,
  GlobalExceptionMapper,
  NotFoundExceptionMapper,
  PayloadTooLargeExceptionMapper,
  UnauthorizedExceptionMapper,
  UnprocessableEntityExceptionMapper,
  ValidationExceptionMapper,
} from './mappers';

export class GlobalExceptionFilter implements ExceptionFilter, RpcExceptionFilter {
  protected readonly logger = new Logger(GlobalExceptionFilter.name);

  private readonly handlers: Record<'http' | 'rpc' | 'ws', ExceptionHandler> = {
    http: new HttpExceptionHandler(),
    rpc: new RpcExceptionHandler(),
    ws: new WsExceptionHandler(),
  };

  private readonly mappers: Record<string, ExceptionMapper> = {
    BadRequestException: new BadRequestExceptionMapper(),
    ConflictException: new ConflictExceptionMapper(),
    ForbiddenException: new ForbiddenExceptionMapper(),
    NestNotFoundException: new NotFoundExceptionMapper(),
    EntityNotFound: new NotFoundExceptionMapper(),
    NotFoundException: new NotFoundExceptionMapper(),
    EntityRelationNotFound: new NotFoundExceptionMapper(),
    PayloadTooLargeException: new PayloadTooLargeExceptionMapper(),
    UnauthorizedException: new UnauthorizedExceptionMapper(),
    UnprocessableEntityException: new UnprocessableEntityExceptionMapper(),
    ValidationException: new ValidationExceptionMapper(),
    BaseHttpException: new GlobalExceptionMapper(),
    IllegalStateException: new GlobalExceptionMapper(),
  };

  constructor(
    private readonly httpAdapterHost: HttpAdapterHost,
    private readonly configuration: Configuration,
    private readonly i18n: I18nService,
  ) {}

  catch(exception: any, host: ArgumentsHost): any {
    try {
      this.logInto3rdParties(exception);

      const mappedException = this.mapException(exception);

      if (this.configuration.debug) {
        mappedException.debug = this.getDebugData(exception);
      }
      if (!exception.useOriginalMessage) {
        mappedException.message = this.i18n.translate(`error-messages.${mappedException.errorCode}`);
      }

      return this.handlers[host.getType()].handle(mappedException, host, this.httpAdapterHost);
    } catch (exception) {
      this.logger.error(exception);
    }
  }

  private mapException(exception: any): ExceptionResponse {
    if (this.shouldSkipMap(exception)) {
      return exception;
    }

    const mapper = this.mappers[exception.name];

    let mappedException: ExceptionResponse;
    if (!mapper) {
      mappedException = this.getGlobalMapper().map(exception);
    } else {
      mappedException = mapper.map(exception);
    }

    if (this.isUnknownException(mappedException)) {
      mappedException = this.getGlobalMapper().map(
        new IllegalStateException('Oops!! unexpected error occurred!', {
          cause: exception,
        }),
      );
    }

    return mappedException;
  }

  private shouldSkipMap(exception: any): boolean {
    return isNumber(exception.statusCode) && isString(exception.errorCode) && exception.status == Status.FAILURE;
  }

  private isUnknownException(exception: any): boolean {
    return !isNumber(exception.statusCode);
  }

  private getGlobalMapper(): GlobalExceptionMapper {
    return this.mappers['BaseHttpException']!;
  }

  private getDebugData(exception: any): any {
    try {
      return JSON.parse(JSON.stringify(exception, Object.getOwnPropertyNames(exception)));
    } catch (error) {
      this.logger.error(error);
    }
  }

  private logInto3rdParties(exception: any): void {
    this.logger.error(this.getDebugData(exception));

    if (!!exception['status'] && isNumber(exception['status']) && exception['status'] !== 500) {
      return;
    }

    captureException(exception);
  }
}

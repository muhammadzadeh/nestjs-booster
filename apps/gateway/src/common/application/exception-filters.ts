import { INestApplication } from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { GlobalExceptionFilter } from '@repo/exception/global.filter';
import { I18nService } from 'nestjs-i18n';

export function configureGlobalFilters(app: INestApplication): void {
  const httpAdapterHost = app.get(HttpAdapterHost);
  const i18n = app.get<I18nService>(I18nService);

  app.useGlobalFilters(new GlobalExceptionFilter(httpAdapterHost, i18n));
}

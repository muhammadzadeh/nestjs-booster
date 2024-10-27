import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { Configuration } from '@repo/config';
import { randomUUID } from 'crypto';
import { AppModule } from './app/app.module';
import './common/apm';
import { configureGlobalCors } from './common/application/cors';
import { configureGlobalFilters } from './common/application/exception-filters';
import { configureGlobalInterceptors } from './common/application/interceptors';
import { configureGlobalLogger } from './common/application/logger';
import { configureGlobalMultipart } from './common/application/multipart';
import { configureGlobalPipes } from './common/application/pipes';
import { configureSecurity } from './common/application/security';
import { configureSentry } from './common/application/sentry';
import { configureSwagger } from './common/application/swagger';
import { configureGlobalTransformers } from './common/application/transformers';

async function bootstrap() {
  const fastify = new FastifyAdapter({
    maxParamLength: 500,
    trustProxy: true,
    requestTimeout: 30000,
    connectionTimeout: 30000,
    genReqId() {
      return randomUUID();
    },
  });
  const app = await NestFactory.create<NestFastifyApplication>(AppModule, fastify, {
    bufferLogs: true,
    rawBody: true,
  });

  app.enableShutdownHooks();
  configureGlobalLogger(app);
  configureGlobalCors(app);
  await configureGlobalMultipart(app);
  configureGlobalTransformers(app.select(AppModule));
  configureSwagger(app);
  configureSentry(app);

  configureGlobalFilters(app);
  configureGlobalInterceptors(app);
  configureGlobalPipes(app);
  configureSecurity(app);

  const defaultPort = process.env.PORT || app.get(Configuration).http.port || 3000;

  return app.listen(
    {
      port: +defaultPort,
      host: '0.0.0.0',
    },
    (err: Error | null, address: string) => {
      if (err) {
        Logger.debug(`Failed to run application!, ${err.message}`, 'NestApplication');
        Logger.error(err, 'NestApplication');
      } else {
        Logger.log(`The application running on the ${address}`, 'NestApplication');
      }
    },
  );
}
bootstrap();

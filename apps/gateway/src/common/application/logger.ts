import { INestApplication } from '@nestjs/common';
import { Configuration } from '@repo/config';
import { now } from '@repo/utils/time';
import * as requestIp from '@supercharge/request-ip';
import { WINSTON_MODULE_NEST_PROVIDER, WinstonLogger } from 'nest-winston';

const getUserIp = (request: any): string | undefined => {
  return requestIp.getClientIp(request);
};

export function configureGlobalLogger(app: INestApplication): void {
  const logger: WinstonLogger = app.get(WINSTON_MODULE_NEST_PROVIDER);
  const configuration = app.get(Configuration);

  app.useLogger(logger);
  app.flushLogs();
  app
    .getHttpAdapter()
    .getInstance()
    .addHook('preValidation', (_req: any, reply: any, done: any) => {
      logRequest(reply).catch((error) => logger.error(error));
      done();
    });

  app
    .getHttpAdapter()
    .getInstance()
    .addHook('onSend', (req: any, reply: any, payload: any, done: any) => {
      logResponse(req, reply, payload).catch((error) => logger.error(error));
      done();
    });

  function shouldIgnoreRoute(req: any): boolean {
    const url: string = req.raw.url;
    const ignoredRoutes = configuration.logger.ignoredRoutes();
    return ignoredRoutes.findIndex((ignoredRoute) => url.includes(ignoredRoute)) > -1;
  }

  function extractResponse(payload: any): any {
    try {
      return JSON.parse(payload);
    } catch (error) {
      return { payload, message: 'Body is not parsable' };
    }
  }

  async function logRequest(reply: any): Promise<void> {
    reply.startTime = now().toJSDate().getTime();
  }

  async function logResponse(req: any, reply: any, payload: any): Promise<void> {
    const level = +reply.raw.statusCode < 300 && +reply.raw.statusCode >= 200 ? 'info' : 'error';
    const responseBody = extractResponse(payload);
    const message = level === 'info' ? 'OK' : responseBody.message;
    const log = {
      context: 'EdgeLogger',
      message,
      level: level,
      request_id: req.id,
      method: req.method,
      ip: getUserIp(req),
      url: req.raw.url,
      status_code: reply.raw.statusCode,
      duration_ms: now().toJSDate().getTime() - reply.startTime,
      user: {
        id: reply?.request?.user?.id,
        email: reply?.request?.user?.email,
        type: reply?.request?.user?.type,
      },
      http:
        level === 'error' || (level === 'info' && !shouldIgnoreRoute(req))
          ? {
              request: {
                query: req.query,
                param: req.param,
                headers: req.headers ? { ...req.headers, authorization: 'filtered', cookie: 'filtered' } : {},
                body: req.body,
              },
              response: {
                body: responseBody,
              },
            }
          : undefined,
    };

    logger.log(log);
  }
}

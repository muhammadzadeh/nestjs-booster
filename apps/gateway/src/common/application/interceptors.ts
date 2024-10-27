import {
  CallHandler,
  ExecutionContext,
  INestApplication,
  Injectable,
  NestInterceptor,
  SetMetadata,
} from '@nestjs/common';
import { PATH_METADATA } from '@nestjs/common/constants';
import { FastifyReply } from 'fastify';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
class SwaggerNoCacheInterceptor implements NestInterceptor {
  constructor() {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const path: string = Reflect.getMetadata(PATH_METADATA, context.getHandler());
    if (path === 'docs-json' || path == 'docs') {
      SetMetadata('ignoreCache', true);
      return next.handle().pipe(
        tap(() => {
          const ResponseObj = context.switchToHttp().getResponse<FastifyReply>();
          ResponseObj.header('Cache-Control', 'no-cache');
        }),
      );
    }
    return next.handle();
  }
}

export function configureGlobalInterceptors(app: INestApplication): void {
  app.useGlobalInterceptors(new SwaggerNoCacheInterceptor());
}

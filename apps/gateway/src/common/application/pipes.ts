import { INestApplication, ValidationPipe } from '@nestjs/common';
import { ValidationException } from '@repo/exception';

export function configureGlobalPipes(app: INestApplication): void {
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      exceptionFactory: (errors): ValidationException => ValidationException.fromErrors(errors),
      stopAtFirstError: true,
    }),
  );
}

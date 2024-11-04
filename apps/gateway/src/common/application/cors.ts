import { INestApplication } from '@nestjs/common';

export function configureGlobalCors(app: INestApplication): void {
  app.enableCors();
}

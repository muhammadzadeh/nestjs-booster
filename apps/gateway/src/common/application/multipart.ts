import fmp from '@fastify/multipart';
import { NestFastifyApplication } from '@nestjs/platform-fastify';

export  async function configureGlobalMultipart(app: NestFastifyApplication): Promise<void> {
  await app.register(fmp, {
    throwFileSizeLimit: false,
  });
}

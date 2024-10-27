import { INestApplication } from '@nestjs/common';
import { Configuration } from '@repo/config';
import * as Sentry from '@sentry/node';

export function configureSentry(app: INestApplication): void {
  const configuration = app.get(Configuration);
  const { sentry: sentryConfig, app: appConfigs } = configuration;

  if (sentryConfig == undefined || !sentryConfig.enabled) {
    return;
  }

  Sentry.init({ ...sentryConfig, environment: appConfigs.env });
}

import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { Configuration } from '@repo/config';
import { CAPTCHA_PROVIDER_TOKEN, CaptchaProvider } from './application/captcha-provider';
import { Recaptcha } from './infrastructure/providers/recaptcha';
import { CaptchaGuard } from './infrastructure/web/guard';

@Module({
  imports: [HttpModule],
  controllers: [],
  providers: [
    {
      provide: CAPTCHA_PROVIDER_TOKEN,
      inject: [Configuration],
      useFactory: (config: Configuration): CaptchaProvider => {
        switch (config.captcha!.provider) {
          case 'recaptcha':
            return new Recaptcha({
              enabled: config.captcha!.enabled,
              secret: config.captcha!.recaptcha.secret!,
            });

          default:
            return new Recaptcha({
              enabled: config.captcha!.enabled,
              secret: config.captcha!.recaptcha.secret!,
            });
        }
      },
    },
    CaptchaGuard,
  ],
  exports: [],
})
export class CaptchaModule {}

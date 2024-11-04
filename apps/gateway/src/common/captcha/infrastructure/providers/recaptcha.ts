import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { CaptchaProvider, InvalidRecaptchaException } from '../../application/captcha-provider';

@Injectable()
export class Recaptcha implements CaptchaProvider {
  private readonly logger = new Logger(Recaptcha.name);

  private readonly httpService: HttpService = new HttpService();
  private readonly verifyUrl = 'https://www.google.com/recaptcha/api/siteverify';

  constructor(private readonly config: ReCaptchaOptions) {}

  async validate(token: string): Promise<boolean> {
    if (!this.config.enabled) {
      return true;
    }

    if (!token) {
      throw new InvalidRecaptchaException('The captcha token is not provided!');
    }

    try {
      const captcha = await this.httpService.axiosRef.post(this.verifyUrl, null, {
        headers: {
          'content-type': 'application/x-www-form-urlencoded',
        },
        params: {
          secret: this.config.secret,
          response: token,
        },
      });

      if (captcha.data.success === false) {
        throw new InvalidRecaptchaException('The Provider is not verified token');
      }
    } catch (error: any) {
      this.logger.error(error);
      throw new InvalidRecaptchaException(`Token verification failed, cause: ${error.message}`, { cause: error });
    }

    return true;
  }

  getName(): string {
    return 'recaptcha';
  }
}

export interface ReCaptchaOptions {
  readonly enabled: boolean;
  readonly secret: string;
}

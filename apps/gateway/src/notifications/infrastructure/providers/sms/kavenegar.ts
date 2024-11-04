import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { NotificationDispatcherResponse } from '../../../application/notifications.dispatcher';
import { SendSmsData, SmsSender } from '../../../application/sms-provider.interface';
import { NotificationChannelStatus } from '../../../domain/entities/notification.entity';

@Injectable()
export class KavenegarSmsSender implements SmsSender {
  private readonly logger = new Logger(KavenegarSmsSender.name);
  private readonly httpService: HttpService = new HttpService();

  constructor(private readonly options: KavenegarConfig) {}

  async send(data: SendSmsData): Promise<NotificationDispatcherResponse> {
    this.logger.verbose(`sending sms to ${data.to} using kavenegar`);
    const result = await this.httpService.axiosRef.get(
      `https://api.kavenegar.com/v1/${this.options.apiKey}/verify/lookup.json`,
      {
        params: {
          receptor: data.to,
          token: data.message,
          template: data.template,
        },
        validateStatus: () => true,
      },
    );

    return {
      status:
        result.status >= 300 && result.status < 200 ? NotificationChannelStatus.FAILED : NotificationChannelStatus.SENT,
      providerResult: result.data,
    };
  }

  getName(): string {
    return 'kavenegar';
  }
}

export interface KavenegarConfig {
  readonly apiKey: string;
}

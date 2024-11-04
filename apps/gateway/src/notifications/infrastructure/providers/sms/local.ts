import { Injectable, Logger } from '@nestjs/common';
import { NotificationDispatcherResponse } from '../../../application/notifications.dispatcher';
import { SendSmsData, SmsSender } from '../../../application/sms-provider.interface';
import { NotificationChannelStatus } from '../../../domain/entities/notification.entity';

@Injectable()
export class LocalSmsSender implements SmsSender {
  private readonly logger = new Logger(LocalSmsSender.name);

  getName(): string {
    return 'local';
  }

  async send(data: SendSmsData): Promise<NotificationDispatcherResponse> {
    this.logger.verbose(`The SMS sent successfully, ${JSON.stringify(data)}`);
    return {
      status: NotificationChannelStatus.SENT,
    };
  }
}

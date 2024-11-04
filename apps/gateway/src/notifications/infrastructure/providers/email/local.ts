import { Injectable, Logger } from '@nestjs/common';
import { SendEmailData, Mailer } from '../../../application/email-provider.interface';
import { NotificationChannelStatus } from '../../../domain/entities/notification.entity';
import { NotificationDispatcherResponse } from '../../../application/notifications.dispatcher';

@Injectable()
export class LocalMailer implements Mailer {
  private readonly logger = new Logger(LocalMailer.name);

  getName(): string {
    return 'local';
  }

  async sendMail(data: SendEmailData): Promise<NotificationDispatcherResponse> {
    this.logger.verbose(`localMailer::sendMail :: ${JSON.stringify(data)}`);
    return {
      status: NotificationChannelStatus.SENT,
    };
  }
}

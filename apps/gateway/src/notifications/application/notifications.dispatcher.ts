import { Inject, Injectable, Logger } from '@nestjs/common';
import { NotificationChannelStatus, NotificationEntity } from '../domain/entities/notification.entity';
import { MAILER_TOKEN, Mailer } from './email-provider.interface';
import { SMS_SENDER_TOKEN, SmsSender } from './sms-provider.interface';

@Injectable()
export class NotificationsDispatcher {
  private readonly logger = new Logger(NotificationsDispatcher.name);

  constructor(
    @Inject(SMS_SENDER_TOKEN) private readonly smsSender: SmsSender,
    @Inject(MAILER_TOKEN) private readonly mailer: Mailer,
  ) {}

  async dispatch(input: NotificationEntity): Promise<void> {
    this.logger.verbose(`dispatching notification ${input.id}`);

    if (input.shouldSentByEmail()) {
      await this.sendEmail(input);
    }

    if (input.shouldSentBySMS()) {
      await this.sendSMS(input);
    }

  }

  private async sendEmail(input: NotificationEntity): Promise<NotificationDispatcherResponse> {
    try {
      return this.mailer.sendMail(input.emailData!);
    } catch (error: any) {
      return {
        status: NotificationChannelStatus.FAILED,
        providerResult: error.message,
      };
    }
  }


  private async sendSMS(input: NotificationEntity): Promise<NotificationDispatcherResponse> {
    try {
      return this.smsSender.send(input.smsData!);
    } catch (error: any) {
      return {
        status: NotificationChannelStatus.FAILED,
        providerResult: error.message,
      };
    }
  }

  
}

export interface NotificationDispatcherResponse {
  status: NotificationChannelStatus;
  providerResult?: any;
}
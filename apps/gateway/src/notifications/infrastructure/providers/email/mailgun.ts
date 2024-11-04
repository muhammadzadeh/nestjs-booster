import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import * as qs from 'qs';
import { Configuration } from '@repo/config';
import { SendEmailData, Mailer } from '../../../application/email-provider.interface';
import { NotificationChannelStatus } from '../../../domain/entities/notification.entity';
import { NotificationDispatcherResponse } from '../../../application/notifications.dispatcher';

@Injectable()
export class MailgunMailer implements Mailer {
  private readonly logger = new Logger(MailgunMailer.name);

  constructor(
    private readonly configService: Configuration,
    private readonly httpService: HttpService,
  ) {}

  getName(): string {
    return 'mailgun';
  }

  async sendMail(data: SendEmailData): Promise<NotificationDispatcherResponse> {
    const opt = this.configService.mailer!;

    const mail_options = {
      from: this.configService.mailer!.sender,
      to: data.to,
      subject: data.title,
      text: data.title,
      template: data.template,
      'h:X-Mailgun-Variables': JSON.stringify(data.body),
    };

    const mail_auth = {
      username: opt.auth.user,
      password: opt.auth.pass,
    };

    try {
      const result = await this.httpService.axiosRef.post(opt.host, qs.stringify(mail_options), {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        auth: mail_auth,
      });
      this.logger.verbose(`Message sent: ${JSON.stringify(mail_options, null, 2)}`);
      return {
        status: NotificationChannelStatus.SENT,
        providerResult: result.data,
      };
    } catch (error) {
      this.logger.error(
        `Message (from: ${mail_options.from}, to: ${mail_options.to}, title: ${mail_options.text}) failed. ${error}`,
      );
      return {
        status: NotificationChannelStatus.FAILED,
        providerResult: error,
      };
    }
  }
}

import { Injectable, Logger } from '@nestjs/common';
import nodemailer from 'nodemailer';
import { Configuration } from '@repo/config';
import { SendEmailData, Mailer } from '../../../application/email-provider.interface';
import { NotificationChannelStatus } from '../../../domain/entities/notification.entity';
import { NotificationDispatcherResponse } from '../../../application/notifications.dispatcher';

@Injectable()
export class SendgridMailer implements Mailer {
  private readonly logger = new Logger(SendgridMailer.name);

  constructor(private readonly configService: Configuration) {}

  getName(): string {
    return 'sendgrid';
  }

  async sendMail(data: SendEmailData): Promise<NotificationDispatcherResponse> {
    const opt = this.configService.mailer!;
    const transporter = nodemailer.createTransport(opt);

    const mailOptions = {
      from: this.configService.mailer!.sender,
      to: data.to,
      subject: data.title,
      text: data.title,
      html: data.body,
    };

    try {
      const email = await transporter.sendMail(mailOptions);
      this.logger.verbose(`sendgrid::sendMail. Message sent: ${email.response}`);
      return {
        status: NotificationChannelStatus.SENT,
        providerResult: email.response,
      };
    } catch (error) {
      this.logger.error(
        `sendgrid::sendMail. Message (from: ${mailOptions.from}, to: ${mailOptions.to}, title: ${mailOptions.text}) failed. ${error}`,
      );
      return {
        status: NotificationChannelStatus.FAILED,
        providerResult: error,
      };
    }
  }
}

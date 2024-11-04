import { Injectable, Logger } from '@nestjs/common';
import { Configuration } from '@repo/config';
import {
  EmailNotificationPayload,
  NotificationEvent,
} from '../../../notifications/domain/entities/notification.entity';
import { MAIL_TEMPLATE } from '../../../notifications/infrastructure/constants';
import { sendNotification } from '../../../notifications/infrastructure/utils';
import { OTPReason, OTPType } from '../../domain/entities';
import { OtpGeneration } from './otp.service';

@Injectable()
export class AuthenticationNotifier {
  private readonly logger = new Logger(AuthenticationNotifier.name);

  constructor(private readonly config: Configuration) {}

  async sendOtp(data: OtpGeneration, otp: string): Promise<void> {
    if (data.email) {
      await this.sendToEmail(data, otp);
    } else if (data.mobile) {
      await this.sendToMobile(data, otp);
    }
  }

  private async sendToEmail(data: OtpGeneration, otp: string): Promise<void> {
    const emailDataStrategy: { [key: string]: Function } = {
      [`${OTPType.TOKEN}_${OTPReason.VERIFY}`]: () => this.getEmailDataForVerify(data, otp),
      [`${OTPType.TOKEN}_${OTPReason.RESET_PASSWORD}`]: () => this.getEmailDataForResetPassword(data, otp),
      [`${OTPType.TOKEN}_${OTPReason.LOGIN}`]: () => this.getEmailDataForLogin(data, otp),
      [`${OTPType.CODE}`]: () => this.getEmailDataForCode(data, otp),
    };

    const strategyKey = data.type === OTPType.CODE ? `${OTPType.CODE}` : `${data.type}_${data.reason}`;

    if (!emailDataStrategy[strategyKey]) {
      this.logger.log(`The emailDataStrategy is undefined for  ${data.type} and ${data.reason}`);
      return;
    }

    const emailData = emailDataStrategy[strategyKey]();

    sendNotification({
      event: NotificationEvent.OTP_GENERATED,
      emailData: emailData!,
    });
  }

  private async sendToMobile(data: OtpGeneration, otp: string): Promise<void> {
    sendNotification({
      event: NotificationEvent.OTP_GENERATED,
      smsData: {
        message: otp,
        to: data.mobile!,
        template: 'verify',
      },
    });
  }

  private getEmailDataForVerify(data: OtpGeneration, otp: string): EmailNotificationPayload {
    return {
      to: data.email!,
      title: `Dear, Verify your email address, please!`,
      template: MAIL_TEMPLATE.COMMON.VERIFY_EMAIL_TOKEN,
      body: {
        url: `${this.config.frontEnd.verifyOtpUrl}?otp=${otp}&type=${data.type}&email=${data.email!}&reason=${data.reason}`,
        expireAt: data.expireAt.toISOString(),
      },
    };
  }

  private getEmailDataForResetPassword(data: OtpGeneration, otp: string): EmailNotificationPayload {
    return {
      to: data.email!,
      title: `Dear, The password reset link sent to your email!`,
      template: MAIL_TEMPLATE.COMMON.REQUEST_PASSWORD_CHANGE,
      body: {
        url: `${this.config.frontEnd.resetPasswordUrl}?otp=${otp}&type=${data.type}&email=${data.email!}&reason=${data.reason}`,
      },
    };
  }

  private getEmailDataForLogin(data: OtpGeneration, otp: string): EmailNotificationPayload {
    return {
      to: data.email!,
      title: `Dear, magic login!`,
      template: MAIL_TEMPLATE.COMMON.VERIFY_EMAIL_TOKEN,
      body: {
        url: `${this.config.frontEnd.verifyOtpUrl}?otp=${otp}&type=${data.type}&email=${data.email!}&reason=${data.reason}`,
        expireAt: data.expireAt.toISOString(),
      },
    };
  }

  private getEmailDataForCode(data: OtpGeneration, otp: string): EmailNotificationPayload {
    return {
      to: data.email!,
      title: `Dear, OTP!`,
      template: MAIL_TEMPLATE.COMMON.VERIFY_EMAIL_OTP,
      body: {
        code: otp,
      },
    };
  }
}

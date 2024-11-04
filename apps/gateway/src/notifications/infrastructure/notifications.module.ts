import { HttpModule, HttpService } from '@nestjs/axios';
import { Module, Provider } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Configuration } from '@repo/config';
import { MAILER_TOKEN, Mailer } from '../application/email-provider.interface';
import { NotificationsConsumer } from '../application/notifications.consumer';
import { NotificationsDispatcher } from '../application/notifications.dispatcher';
import { NotificationsService } from '../application/notifications.service';
import { SMS_SENDER_TOKEN, SmsSender } from '../application/sms-provider.interface';
import { NOTIFICATION_PUSH_TOKEN_REPOSITORY_TOKEN } from '../domain/repositories/notification-push-tokens.repository';
import { NOTIFICATION_REPOSITORY_TOKEN } from '../domain/repositories/notifications.repository';
import { TypeormNotificationPushTokenEntity } from './database/entities/typeorm-notification-push-token.entity';
import { TypeormNotificationEntity } from './database/entities/typeorm-notification.entity';
import { TypeormNotificationPushTokensRepository } from './database/repositories/typeorm-notification-push-token.repository';
import { TypeormNotificationsRepository } from './database/repositories/typeorm-notification.repository';
import { LocalMailer, MailgunMailer, SendgridMailer } from './providers/email';
import { KavenegarSmsSender } from './providers/sms/kavenegar';
import { LocalSmsSender } from './providers/sms/local';
import { NotificationController } from './web/notification.controller';

const mailProvider: Provider = {
  provide: MAILER_TOKEN,
  inject: [Configuration, HttpService],
  useFactory: (config: Configuration, httpService: HttpService): Mailer => {
    switch (config.mailer?.provider) {
      case 'local':
        return new LocalMailer();
      case 'mailgun':
        return new MailgunMailer(config, httpService);
      case 'sendgrid':
        return new SendgridMailer(config);
      default:
        return new LocalMailer();
    }
  },
};

const smsProvider: Provider = {
  provide: SMS_SENDER_TOKEN,
  inject: [Configuration, HttpService],
  useFactory: (config: Configuration): SmsSender => {
    switch (config.smsSender?.provider) {
      case 'kavenegar':
        return new KavenegarSmsSender({
          apiKey: config.smsSender.kavenegar.apiKey,
        });
      case 'local':
        return new LocalSmsSender();
      default:
        return new LocalSmsSender();
    }
  },
};

const notificationsRepository: Provider = {
  provide: NOTIFICATION_REPOSITORY_TOKEN,
  useClass: TypeormNotificationsRepository,
};

const notificationPushTokensRepository: Provider = {
  provide: NOTIFICATION_PUSH_TOKEN_REPOSITORY_TOKEN,
  useClass: TypeormNotificationPushTokensRepository,
};

@Module({
  imports: [TypeOrmModule.forFeature([TypeormNotificationEntity, TypeormNotificationPushTokenEntity]), HttpModule],
  controllers: [NotificationController],
  providers: [
    mailProvider,
    smsProvider,
    NotificationsConsumer,
    NotificationsDispatcher,
    NotificationsService,
    notificationsRepository,
    notificationPushTokensRepository,
  ],
  exports: [],
})
export class NotificationsModule {}

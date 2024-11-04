import { Injectable } from '@nestjs/common';
import { Type } from 'class-transformer';
import { IsBoolean, IsNotEmpty, IsOptional, ValidateNested, validateSync } from 'class-validator';
import { ToBoolean } from '@repo/decorator';
import { AppConfigs } from './app';
import { AuthenticationConfig } from './authentication.config';
import { CaptchaConfig } from './captcha';
import { DefaultUserConfig } from './default-user';
import { FrontEndConfig } from './frontend';
import { HttpConfig } from './http';
import { LoggerConfig } from './logger';
import { MailerConfig } from './mailer';
import { PostgresConfig } from './postgres';
import { RabbitConfig } from './rabbit';
import { RedisConfig } from './redis-cache';
import { SentryConfig } from './sentry';
import { SmsSenderConfig } from './sms-sender';
import { StorageConfig } from './storage';
import { SwaggerConfig } from './swagger';
import { ThrottlingConfig } from './throttling';
import { VaultConfig } from './vault';

@Injectable()
export class Configuration {
  validate() {
    this.callRevalidateRecursively(this);
    const errors = validateSync(this, { forbidUnknownValues: true, stopAtFirstError: true });
    if (errors.length) {
      throw new Error(`Error with configuration:\n\t${JSON.stringify(errors)}`);
    }
  }

  callRevalidateRecursively(obj: any) {
    if (typeof obj === 'object' && obj !== null) {
      if (typeof obj.revalidate === 'function') {
        obj.revalidate();
      }

      const keys = Object.keys(obj);
      for (const key of keys) {
        this.callRevalidateRecursively(obj[key]);
      }
    }
  }

  @IsNotEmpty()
  @ValidateNested()
  @Type(() => AppConfigs)
  readonly app!: AppConfigs;

  @IsOptional()
  @ValidateNested()
  @Type(() => VaultConfig)
  readonly vault?: VaultConfig;

  @IsNotEmpty()
  @ValidateNested()
  @Type(() => FrontEndConfig)
  readonly frontEnd!: FrontEndConfig;

  @IsNotEmpty()
  @ValidateNested()
  @Type(() => HttpConfig)
  readonly http!: HttpConfig;

  @IsNotEmpty()
  @ValidateNested()
  @Type(() => RedisConfig)
  readonly globalCache!: RedisConfig;

  @IsNotEmpty()
  @ValidateNested()
  @Type(() => ThrottlingConfig)
  readonly throttling!: ThrottlingConfig;

  @IsNotEmpty()
  @ValidateNested()
  @Type(() => PostgresConfig)
  readonly database!: PostgresConfig;

  @IsNotEmpty()
  @IsBoolean()
  @ToBoolean()
  readonly debug!: boolean;

  @IsNotEmpty()
  @ValidateNested()
  @Type(() => AuthenticationConfig)
  readonly authentication!: AuthenticationConfig;

  @IsNotEmpty()
  @ValidateNested()
  @Type(() => StorageConfig)
  readonly storage!: StorageConfig;

  @IsNotEmpty()
  @ValidateNested()
  @Type(() => MailerConfig)
  readonly mailer!: MailerConfig;

  @IsNotEmpty()
  @ValidateNested()
  @Type(() => SmsSenderConfig)
  readonly smsSender!: SmsSenderConfig;

  @IsNotEmpty()
  @ValidateNested()
  @Type(() => SwaggerConfig)
  readonly swagger?: SwaggerConfig;

  @IsNotEmpty()
  @ValidateNested()
  @Type(() => SentryConfig)
  readonly sentry!: SentryConfig;

  @IsNotEmpty()
  @ValidateNested()
  @Type(() => CaptchaConfig)
  readonly captcha?: CaptchaConfig;

  @IsNotEmpty()
  @ValidateNested()
  @Type(() => LoggerConfig)
  readonly logger!: LoggerConfig;

  @IsNotEmpty()
  @ValidateNested()
  @Type(() => RabbitConfig)
  readonly rabbit!: RabbitConfig;

  @IsOptional()
  @ValidateNested()
  @Type(() => DefaultUserConfig)
  readonly defaultUser?: DefaultUserConfig;
}

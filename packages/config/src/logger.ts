import { Type } from 'class-transformer';
import { IsBoolean, IsDefined, IsNumber, IsOptional, IsString, ValidateNested } from 'class-validator';
import { support } from 'fluent-logger';
import { utilities as nestWinstonModuleUtilities } from 'nest-winston';
import * as winston from 'winston';
import { AppConfigs } from './app';

class ConsoleConfig {
  @IsBoolean()
  @Type(() => Boolean)
  readonly enabled: boolean = false;

  @IsDefined()
  @IsString()
  @Type(() => String)
  readonly level!: string;
}

class FluentConfig {
  @IsBoolean()
  @Type(() => Boolean)
  readonly enabled: boolean = false;

  @IsDefined()
  @IsString()
  @Type(() => String)
  readonly host!: string;

  @IsDefined()
  @IsNumber()
  @Type(() => Number)
  readonly port!: number;

  @IsDefined()
  @IsNumber()
  @Type(() => Number)
  readonly timeout!: number;

  @IsDefined()
  @IsBoolean()
  @Type(() => Boolean)
  readonly requireAckResponse!: boolean;
}

export class LoggerConfig {
  @IsOptional()
  @ValidateNested()
  @Type(() => ConsoleConfig)
  readonly console?: ConsoleConfig;

  @IsOptional()
  @ValidateNested()
  @Type(() => FluentConfig)
  readonly fluent?: FluentConfig;

  transports(appConfig: AppConfigs): any[] {
    const appliedTransports = [];

    if (this.fluent?.enabled) {
      const fluentTransport = support.winstonTransport();
      const tag = `${appConfig.name}-${appConfig.env}`;
      appliedTransports.push(new fluentTransport(tag, this.fluent));
    }

    if (this.console?.enabled) {
      appliedTransports.push(
        new winston.transports.Console({
          level: this.console.level,
          format: winston.format.combine(
            winston.format.timestamp(),
            winston.format.ms(),
            nestWinstonModuleUtilities.format.nestLike(appConfig.name, {
              colors: true,
              prettyPrint: true,
            }),
          ),
        }),
      );
    }
    return appliedTransports;
  }

  ignoredRoutes(): string[] {
    return [
      '/metrics',
      '/favicon.ico',
      '/docs',
      '/health',
      '/common/auth/signin',
      '/common/auth/signup',
      '/common/auth/refresh-token',
      '/attachments',
    ];
  }
}

import { BullModule, InjectQueue } from '@nestjs/bull';
import { Logger, Module, OnApplicationBootstrap, OnModuleInit } from '@nestjs/common';
import { DiscoveryService } from '@nestjs/core';
import { ScheduleModule } from '@nestjs/schedule';
import { TerminusModule } from '@nestjs/terminus';
import { ThrottlerModule } from '@nestjs/throttler';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, Configuration } from '@repo/config';
import { RabbitMQModule } from '@repo/rabbit/rabbit-mq.module';
import { DATABASE_SEEDER_TAG } from '@repo/types/database';
import { Queue } from 'bull';
import { WinstonModule } from 'nest-winston';
import { AcceptLanguageResolver, HeaderResolver, I18nModule, QueryResolver } from 'nestjs-i18n';
import { join } from 'node:path';
import { AttachmentsModule } from '../attachments/attachments.module';
import { AuthenticationModule } from '../authentication/infrastructure/authentication.module';
import { CacheServiceModule } from '../common/cache/cache.module';
import { CaptchaModule } from '../common/captcha/captcha.module';
import { AuthModule } from '../common/guards';
import { HealthController } from '../common/health/health.controller';
import { ThrottlerStorageRedisService } from '../common/throttler';
import typeormOptions from '../common/typeorm';
import { CountryModule } from '../countries/infrastructure/country.module';
import { NotificationsModule } from '../notifications/infrastructure/notifications.module';
import { ProfileModule } from '../users/profiles/infrastructure/profiles.module';

@Module({
  imports: [
    ConfigModule.forRootAsync({
      inject: [],
      useFactory: () => ({ filePath: '../../apps/gateway/config.yml' }),
    }),
    WinstonModule.forRootAsync({
      inject: [Configuration],
      useFactory: ({ logger, app }: Configuration) => ({
        transports: logger.transports(app),
      }),
    }),
    I18nModule.forRootAsync({
      useFactory: () => ({
        fallbackLanguage: 'en',
        loaderOptions: {
          path: join(__dirname, '../i18n/'),
          watch: true,
        },
      }),
      resolvers: [{ use: QueryResolver, options: ['lang'] }, AcceptLanguageResolver, new HeaderResolver(['x-lang'])],
    }),
    TypeOrmModule.forRootAsync({
      inject: [Configuration],
      useFactory: (configService: Configuration) => ({ ...configService.database, ...typeormOptions }),
    }),
    BullModule.forRootAsync({
      inject: [Configuration],
      useFactory: async (configService: Configuration) => ({
        redis: configService.globalCache,
      }),
    }),
    ThrottlerModule.forRootAsync({
      inject: [Configuration],
      useFactory: (configService: Configuration) => [
        {
          ...configService.throttling,
          storage: new ThrottlerStorageRedisService({ ...configService.globalCache }),
        },
      ],
    }),
    RabbitMQModule.forRootAsync({
      inject: [Configuration],
      useFactory: (configuration: Configuration) => ({ ...configuration.rabbit }),
    }),
    BullModule.registerQueue({
      name: 'jobs',
    }),
    CacheServiceModule,
    ScheduleModule.forRoot(),
    TerminusModule,
    AttachmentsModule,
    AuthenticationModule,
    CaptchaModule,
    AuthModule,
    ProfileModule,
    NotificationsModule,
    CountryModule,
  ],
  controllers: [HealthController],
  providers: [DiscoveryService],
})
export class AppModule implements OnModuleInit, OnApplicationBootstrap {
  private readonly logger = new Logger(AppModule.name);

  constructor(
    private readonly discovery: DiscoveryService,
    @InjectQueue('jobs') private queue: Queue,
  ) {}

  async onModuleInit(): Promise<void> {
    const jobs = await this.queue.getRepeatableJobs();
    for (const job of jobs) {
      await this.queue.removeRepeatableByKey(job.key);
    }
  }

  async onApplicationBootstrap() {
    const wrappers = this.discovery.getProviders({});

    for (const wrapper of wrappers) {
      if (!wrapper.metatype || !Reflect.getMetadata(DATABASE_SEEDER_TAG, wrapper.metatype)) {
        continue;
      }
      wrapper.instance.run().catch((error: any) => this.logger.error(error.message));
    }
  }
}

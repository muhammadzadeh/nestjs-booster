import { DynamicModule, FactoryProvider, Module, ModuleMetadata, OnModuleInit } from '@nestjs/common';
import { DiscoveryService, MetadataScanner } from '@nestjs/core';
import { RABBIT_MQ_OPTIONS, RABBIT_MQ_SUBSCRIBER_OPTIONS } from './constants';
import { RabbitMQOptions, RabbitMqService } from './rabbit-mq.service';

export interface AsyncRabbitMQOptions extends Pick<ModuleMetadata, 'imports'> {
  useFactory: (...args: any[]) => Promise<RabbitMQOptions> | RabbitMQOptions;
  inject: FactoryProvider['inject'];
}

@Module({
  imports: [],
  providers: [RabbitMqService, DiscoveryService, MetadataScanner],
  exports: [RabbitMqService],
})
export class RabbitMQModule implements OnModuleInit {
  constructor(
    private readonly rabbitMQService: RabbitMqService,
    private readonly metadataScanner: MetadataScanner,
    private readonly discovery: DiscoveryService,
  ) {}

  onModuleInit() {
    const wrappers = this.discovery.getProviders({});

    for (const wrapper of wrappers) {
      if (!wrapper || !wrapper.instance) {
        continue;
      }

      const providerPrototype = Object.getPrototypeOf(wrapper.instance);

      const providerMethods = this.metadataScanner.getAllMethodNames(providerPrototype);
      for (const providerMethod of providerMethods) {
        const rabbitSubscriberOptions = Reflect.getMetadata(
          RABBIT_MQ_SUBSCRIBER_OPTIONS,
          providerPrototype[providerMethod],
        );
        if (!rabbitSubscriberOptions) {
          continue;
        }

        this.rabbitMQService.registerSubscriber(rabbitSubscriberOptions, {
          instance: wrapper.instance,
          handler: providerMethod,
        });
      }
    }
  }

  static forRoot(options: RabbitMQOptions): DynamicModule {
    return {
      providers: [
        {
          provide: RABBIT_MQ_OPTIONS,
          useValue: options,
        },
        RabbitMqService,
      ],
      module: RabbitMQModule,
      exports: [],
      global: true,
    };
  }

  static forRootAsync(options: AsyncRabbitMQOptions): DynamicModule {
    return {
      providers: [
        {
          inject: options.inject,
          provide: RABBIT_MQ_OPTIONS,
          useFactory: options.useFactory,
        },
        RabbitMqService,
      ],
      module: RabbitMQModule,
      exports: [],
      global: true,
    };
  }
}

import { Inject, Injectable, Logger } from '@nestjs/common';
import { Channel, Connection, ConsumeMessage, Options, Replies, connect } from 'amqplib';
import { RABBIT_MQ_OPTIONS } from './constants';

export class RabbitMQExchangeOptions {
  name!: string;
  type!: 'direct' | 'fanout' | 'topic' | 'headers';
}

export class RabbitMQOptions {
  uri!: string;
  exchanges!: RabbitMQExchangeOptions[];
}

export class RabbitMQSubscriberOptions {
  readonly exchange!: string;
  readonly routingKey!: string;
  readonly queue!: string;
}

export class RabbitMQSubscriberHandler {
  readonly handler!: any;
  readonly instance!: any;
}

export class RabbitInstanceHolder {
  private static rabbitMqService: RabbitMqService | undefined;

  static setRabbitMqService(rabbitMqService: RabbitMqService): void {
    this.rabbitMqService = rabbitMqService;
  }

  static getRabbitMqService(): RabbitMqService | undefined {
    return this.rabbitMqService;
  }
}

@Injectable()
export class RabbitMqService {
  private readonly logger = new Logger(RabbitMqService.name);

  private connection: Connection | undefined;
  private channels: Record<string, Channel> = {};
  private consumerHandlers: Record<string, RabbitMQSubscriberHandler> = {};
  private consumerOptions: { options: RabbitMQSubscriberOptions; handler: RabbitMQSubscriberHandler }[] = [];

  constructor(@Inject(RABBIT_MQ_OPTIONS) readonly options: RabbitMQOptions) {
    this.initialize().then(() => this.registerExchange(options.exchanges));
    RabbitInstanceHolder.setRabbitMqService(this);
  }

  async initialize(): Promise<void> {
    if (!this.connection) {
      this.connection = await connect(this.options.uri, { reconnect: true });

      this.connection.on('connect', () => {
        this.logger.verbose(`Successfully connected to RabbitMQ broker`);
      });

      this.connection.on('disconnect', ({ err }: { err: Error }) => {
        this.logger.error(`Disconnected from RabbitMQ broker`, err);
      });
    }
  }

  async registerExchange(exchanges: RabbitMQExchangeOptions[]): Promise<void> {
    for (let i = 0; this.connection && exchanges && i < exchanges.length; i++) {
      const exchange = exchanges[i];
      if (!exchange) {
        continue;
      }

      const channel = await this.connection.createChannel();
      await channel.prefetch(2);
      await channel.assertExchange(exchange.name, exchange.type, { durable: true });
      this.channels[exchange.name] = channel;
      this.logger.verbose(`Exchange (${exchange.name}) created!`);
    }
  }

  async registerSubscriber(
    consumerOption: RabbitMQSubscriberOptions,
    handler: RabbitMQSubscriberHandler,
  ): Promise<void> {
    if (!this.connection) {
      await this.initialize();
      await this.registerExchange(this.options.exchanges);
    }

    this.consumerOptions.push({ options: consumerOption, handler });

    const channel = await this.getChannel(consumerOption.exchange);
    const queue = await this.createQueue(consumerOption.queue, channel);
    await this.bindQueue(consumerOption, channel, queue);
    const { consumerTag } = await this.consumeMessage(channel, queue);

    this.consumerHandlers[consumerTag] = handler;
  }

  async publish(exchange: string, routingKey: string, payload: any, options?: Options.Publish): Promise<void> {
    const channel = await this.connection!.createChannel();
    channel.publish(exchange, routingKey, Buffer.from(JSON.stringify(payload)), options);
    await channel.close();
  }

  private async getChannel(exchange: string): Promise<Channel> {
    let channel = this.channels[exchange];

    if (!channel) {
      channel = await this.connection!.createChannel();
      await channel.prefetch(2);
      this.channels[exchange] = channel;
    }
    return channel;
  }

  private async createQueue(queueName: string, channel: Channel): Promise<Replies.AssertQueue> {
    const queue = await channel.assertQueue(queueName, { durable: true });
    this.logger.verbose(`Queue (${queue.queue}) created!`);
    return queue;
  }

  private async bindQueue(
    consumerOption: RabbitMQSubscriberOptions,
    channel: Channel,
    queue: Replies.AssertQueue,
  ): Promise<void> {
    await channel.bindQueue(queue.queue, consumerOption.exchange, consumerOption.routingKey);
  }

  private async consumeMessage(channel: Channel, queue: Replies.AssertQueue): Promise<Replies.Consume> {
    return await channel.consume(queue.queue, async (msg: ConsumeMessage | null) => {
      if (!msg) {
        return;
      }

      this.logger.verbose(`new Message from queue ${queue.queue}(${msg.fields.consumerTag}) received!`);

      try {
        await this.invokeHandler(msg);
        channel.ack(msg);
      } catch (error) {
        this.logger.error(error);
        channel.nack(msg, false, true);
      }
    });
  }

  private async invokeHandler(msg: ConsumeMessage): Promise<void> {
    const queueHandler = this.consumerHandlers[msg.fields.consumerTag];
    if (queueHandler) {
      await queueHandler.instance[queueHandler.handler](JSON.parse(msg.content.toString()));
    }
  }
}

export async function publish(
  exchange: string,
  routingKey: string,
  payload: any,
  options: Options.Publish = {
    persistent: true,
    deliveryMode: 2,
  },
): Promise<void> {
  await RabbitInstanceHolder.getRabbitMqService()?.publish(exchange, routingKey, payload, options);
}

import { SetMetadata, applyDecorators } from '@nestjs/common';
import { RABBIT_MQ_SUBSCRIBER_OPTIONS } from './constants';
import { RabbitMQSubscriberOptions } from './rabbit-mq.service';

export const OnRabbitEvent = (options: RabbitMQSubscriberOptions) =>
  applyDecorators(SetMetadata(RABBIT_MQ_SUBSCRIBER_OPTIONS, options));

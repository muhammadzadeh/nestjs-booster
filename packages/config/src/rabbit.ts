import { Type } from 'class-transformer';
import { IsDefined, IsString } from 'class-validator';

class RabbitMQExchangeOptions {
  name!: string;
  type!: 'direct' | 'fanout' | 'topic' | 'headers';
}

export class RabbitConfig {
  @IsDefined()
  @IsString()
  @Type(() => String)
  readonly uri!: string;

  readonly exchanges: RabbitMQExchangeOptions[] = [
    {
      name: 'authentication',
      type: 'direct',
    },

    {
      name: 'notification',
      type: 'direct',
    },
  ];
}

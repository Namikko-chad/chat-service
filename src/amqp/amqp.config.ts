import { Inject, } from '@nestjs/common';
import { ConfigService, } from '@nestjs/config';
import { Options, } from 'amqplib';

import { AmqpOptions, } from './amqp.options.interface';

export class AmqpConfig implements AmqpOptions {
  public readonly url: string;
  public readonly exchangeConfig: {
    readonly name: string;
    readonly type: string;
    readonly options?: Readonly<Options.AssertExchange>;
  };
  public readonly queueConfig?: {
    readonly name: string;
    readonly routingKey?: string;
    readonly options?: Readonly<Options.AssertQueue>;
  };

  constructor(@Inject(ConfigService) configService: ConfigService, exchange?: string, queue?: string) {
    this.url = configService.get<string>('RABBIT_URL') || 'amqp://guest:guest@127.0.0.1:5672/',
    this.exchangeConfig = {
      name: exchange ?? 'chat',
      type: 'fanout',
      options: { durable: true, },
    };
    this.queueConfig = {
      name: queue ?? 'chat-queue',
      options: { durable: true, },
    };
  }
}
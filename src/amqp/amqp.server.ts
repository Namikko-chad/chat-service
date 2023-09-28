import { CustomTransportStrategy, RmqContext, Server, } from '@nestjs/microservices';
import { Channel, connect, Connection, } from 'amqplib';

import { AmqpOptions, } from './amqp.options.interface';
  
export const amqpTransport = Symbol('AMQP_TRANSPORT');
  
export class AmqpServer extends Server implements CustomTransportStrategy {
  readonly transportId = amqpTransport;
  
  private connection: Connection | undefined;
  
  constructor(private readonly amqpOptions: AmqpOptions) {
    super();
    
    this.initializeDeserializer({});
    this.initializeSerializer({});
  }
  
  async listen(callback: (...optionalParams: unknown[]) => any) {
    const { url, exchangeConfig, queueConfig, prefetch, } = this.amqpOptions  ;
  
    this.connection = await connect(url);
  
    const channel: Channel = await this.connection.createChannel();
  
    if (prefetch) void channel.prefetch(prefetch);
  
    void channel.assertExchange(
      exchangeConfig.name,
      exchangeConfig.type,
      exchangeConfig.options
    );
  
    if (queueConfig) {
      const queue = await channel.assertQueue(
        queueConfig.name,
        queueConfig.options
      );
  
      await channel.bindQueue(
        queue.queue,
        exchangeConfig.name,
        queueConfig.routingKey || ''
      );
  
      void channel.consume(
        queue.queue,
        async (msg) => {
          if (!msg) return;
  
          const { content, properties, } = msg;
  
          const rawMessage = JSON.parse(content.toString());
  
          const packet = await this.deserializer.deserialize(
            rawMessage,
            properties
          );
  
          const ctx = new RmqContext([msg, channel, packet.pattern]);
  
          this.handleEvent(packet.pattern, packet, ctx);
        },
        { noAck: false, }
      );
    }
  
    callback();
  }
  
  close() {
    if (this.connection) {
      void this.connection.close();
  
      this.connection = undefined;
    }
  }
}
  
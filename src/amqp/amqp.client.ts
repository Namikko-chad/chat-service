import { Logger, } from '@nestjs/common';
import { ClientProxy, ReadPacket, WritePacket, } from '@nestjs/microservices';
import { Channel, connect, Connection, } from 'amqplib';

import { AmqpOptions, } from './amqp.options.interface';

export class AmqpClient extends ClientProxy {
  private readonly logger = new Logger(AmqpClient.name);

  private connection: Connection | undefined;
  private channel: Channel | undefined;

  constructor(private readonly amqpOptions: AmqpOptions) {
    super();

    this.initializeDeserializer({});
    this.initializeSerializer({});
  }

  async connect(): Promise<Connection | void> {
    if (this.connection) return this.connection;

    const { url, exchangeConfig, } = this.amqpOptions;

    this.connection = await connect(url);

    this.channel = await this.connection.createChannel();

    await this.channel.assertExchange(
      exchangeConfig.name,
      exchangeConfig.type,
      exchangeConfig.options
    );
  }

  close() {
    this.connection && void this.connection.close();
    this.channel && void this.channel.close();
    this.connection = undefined;
    this.channel = undefined;
  }

  protected dispatchEvent(packet: ReadPacket<unknown>): any {
    const serializedPacket = this.serializer.serialize(packet) as object;

    if (!this.channel) throw new Error('Channel not configured');

    const exchange = this.amqpOptions.exchangeConfig.name;
    const routingKey = this.amqpOptions.queueConfig?.routingKey || '';

    this.logger.log(`Outgoing message: exchange: ${exchange}, routingKey: ${routingKey} data: ${JSON.stringify(packet.data)}`);

    return this.channel.publish(
      exchange,
      routingKey,
      Buffer.from(JSON.stringify(serializedPacket)),
      { persistent: true, }
    );
  }

  protected publish(
    _: ReadPacket<unknown>,
    __: (packet: WritePacket<unknown>) => void
  ): () => void {
    return () => void 0;
  }
}

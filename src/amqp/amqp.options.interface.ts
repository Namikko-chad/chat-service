import type { Options, } from 'amqplib';

/**
 * Amqp options
 */
export interface AmqpOptions {
  /**
   * Connection url to amqp server
   */
  readonly url: string;
  /**
   * Prefetch count
   *
   * https://amqp-node.github.io/amqplib/channel_api.html#channel_prefetch
   */
  readonly prefetch?: number;
  /**
   * Exchange config
   *
   * https://amqp-node.github.io/amqplib/channel_api.html#channel_assertExchange
   */
  readonly exchangeConfig: {
    /**
     * Exchange name
     */
    readonly name: string;
    /**
     * Exchange type
     */
    readonly type: string;
    /**
     * Exchange options
     */
    readonly options?: Readonly<Options.AssertExchange>;
  };
  /**
   * Queue config
   */
  readonly queueConfig?: {
    /**
     * Queue name
     */
    readonly name: string;
    /**
     * Routing key wich bind queue to exchange
     */
    readonly routingKey?: string;
    /**
     * Queue options
     */
    readonly options?: Readonly<Options.AssertQueue>;
  };
}

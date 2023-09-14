
import { DeepPartial, } from 'typeorm';

import { AbstractGenerator, } from '../../database';
import { Utils, } from '../../utils';
import { Message, } from '../entities/Message.entity';

export interface MessageGeneratorOptions extends Partial<Message> {
  roomId: string;
  userId: string;
}

export class MessageGenerator extends AbstractGenerator<Message> {

  default(): DeepPartial<Message> {
    return {
      id: Utils.getUUID(),
      message: Utils.getUUID(),
    };
  }

  override create(params: MessageGeneratorOptions): Promise<Message> {
    return super.create(params);
  }
}
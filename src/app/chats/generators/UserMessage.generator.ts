
import { DeepPartial, } from 'typeorm';

import { AbstractGenerator, } from '../../database';
import { Utils, } from '../../utils';
import { MessageStatus, } from '../chats.enum';
import { UserMessage, } from '../entities/UserMessage.entity';

export interface UserMessageGeneratorOptions extends Partial<UserMessage> {
  roomId: string;
  userId: string;
  messageId: string;
}

export class UserMessageGenerator extends AbstractGenerator<UserMessage> {

  default(): DeepPartial<UserMessage> {
    return {
      id: Utils.getUUID(),
      status: MessageStatus.New,
    };
  }

  override create(params: UserMessageGeneratorOptions): Promise<UserMessage> {
    return super.create(params);
  }
}

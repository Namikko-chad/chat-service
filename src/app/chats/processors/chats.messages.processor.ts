import { Inject, Injectable, } from '@nestjs/common';
import { DataSource, DeepPartial, Repository, } from 'typeorm';

import { Exception, } from '../../utils';
import { Errors, ErrorsMessages, } from '../chats.enum';
import { Message, } from '../entities/Message.entity';

@Injectable()
export class MessageProcessor {
  private readonly _repository: Repository<Message>;
  
  constructor(@Inject() _ds: DataSource) {
    this._repository = _ds.getRepository(Message);
  };

  async list(roomId: string, take = 10): Promise<Message[]> {
    return this._repository.find({
      where: {
        roomId,
      },
      take,
    });
  }

  async get(messageId: string): Promise<Message> {
    return this._repository.findOneBy({
      id: messageId,
    });
  }

  async create(property: DeepPartial<Message>): Promise<Message> {
    const message = this._repository.create(property);

    return this._repository.save(message);
  }

  async update(roomId: string, messageId: string, property: DeepPartial<Message>): Promise<Message> {
    const message = await this._repository.findOneBy({
      id: messageId,
      roomId,
    });
    if (!message)
      throw new Exception(Errors.MessageNotFound, ErrorsMessages[Errors.MessageNotFound], {
        messageId,
      });

    message.message = property.message || message.message;
    message.edited = true;

    return this._repository.save(message);
  }

  async delete(roomId: string, messageId: string): Promise<void> {
    await this._repository.delete({
      id: messageId,
      roomId,
    });
  }
}
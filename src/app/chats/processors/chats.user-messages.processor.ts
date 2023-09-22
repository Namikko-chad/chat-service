import { Inject, Injectable, } from '@nestjs/common';
import { DataSource, In, Repository, } from 'typeorm';

import { MessageStatus, } from '../chats.enum';
import { UserMessage, } from '../entities/UserMessage.entity';

@Injectable()
export class UserMessageProcessor {
  private readonly _repository: Repository<UserMessage>;
  
  constructor(@Inject(DataSource) private readonly _ds: DataSource) {
    this._repository = this._ds.getRepository(UserMessage);
  };

  async get(roomId: string, userId: string, messageId: string): Promise<UserMessage> {
    return this._repository.findOneBy({
      roomId,
      userId,
      messageId,
    });
  }

  async create(roomId: string, userIds: string[], messageIds: string[]): Promise<void> {
    await this._ds.createQueryBuilder().insert().into(UserMessage)
      .values(
        userIds.map( userId => messageIds.map( messageId => {
          return this._repository.create({
            roomId,
            userId,
            messageId,
          });
        })).flat())
      .execute();
  }

  async deliver(roomId: string, userId: string, messageIds: string[]): Promise<void> {
    await this._repository.update({
      roomId,
      userId,
      messageId: In(messageIds),
      status: MessageStatus.New,
    }, {
      status: MessageStatus.Delivered,
    });
  }

  async read(roomId: string, userId: string, messageIds: string[]): Promise<void> {
    await this._repository.update({
      roomId,
      userId,
      messageId: In(messageIds),
      status: MessageStatus.Delivered,
    }, {
      status: MessageStatus.Read,
    });
  }

  async delete(roomId: string, userId: string, messageIds: string[]): Promise<void> {
    await this._repository.update({
      roomId,
      userId,
      messageId: In(messageIds),
      status: MessageStatus.Read,
    }, {
      status: MessageStatus.Deleted,
    });
  }
}
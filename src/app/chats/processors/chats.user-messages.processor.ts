import { Inject, Injectable, } from '@nestjs/common';
import { DataSource, In, Repository, } from 'typeorm';

import { MessageStatus, } from '../chats.enum';
import { UserMessage, } from '../entities/UserMessage.entity';

@Injectable()
export class UserMessageProcessor {
  private readonly _repository: Repository<UserMessage>;
  
  constructor(@Inject(DataSource) private readonly ds: DataSource) {
    this._repository = this.ds.getRepository(UserMessage);
  };

  async get(roomId: string, userId: string, messageId: string): Promise<UserMessage> {
    return this._repository.findOneBy({
      roomId,
      userId,
      messageId,
    });
  }

  async create(roomId: string, userIds: string[], messageIds: string[]): Promise<void> {
    await this.ds.createQueryBuilder().insert().into(UserMessage)
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

  async deliver(roomIds: string[], userIds: string[], messageIds: string[]): Promise<void> {
    await this._repository.update({
      roomId: In(roomIds),
      userId: In(userIds),
      messageId: In(messageIds),
      status: MessageStatus.New,
    }, {
      status: MessageStatus.Delivered,
    });
  }

  async read(roomIds: string[], userIds: string[], messageIds: string[]): Promise<void> {
    await this._repository.update({
      roomId: In(roomIds),
      userId: In(userIds),
      messageId: In(messageIds),
      status: MessageStatus.Delivered,
    }, {
      status: MessageStatus.Read,
    });
  }

  async delete(roomIds: string[], userIds: string[], messageIds: string[]): Promise<void> {
    await this._repository.update({
      roomId: In(roomIds),
      userId: In(userIds),
      messageId: In(messageIds),
      status: MessageStatus.Read,
    }, {
      status: MessageStatus.Deleted,
    });
  }
}
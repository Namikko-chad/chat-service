import { Inject, Injectable, } from '@nestjs/common';
import { DataSource, } from 'typeorm';

import { 
  MessageCreate, 
  MessageDelete, 
  MessageEdit, 
  RoomCreate, 
  RoomDelete, 
  RoomUpdate, 
  UserAdd, 
  UserMessageDelete, 
  UserMessageDeliver, 
  UserMessageRead, 
  UserRemove, } from './chats.interfaces';
import { Message, } from './entities/Message.entity';
import { Room, } from './entities/Room.entity';
import { FileProcessor, } from './processors/chats.files.processor';
import { MessageProcessor, } from './processors/chats.messages.processor';
import { RoomProcessor, } from './processors/chats.rooms.processor';
import { UserMessageProcessor, } from './processors/chats.user-messages.processor';
import { UserProcessor, } from './processors/chats.users.processor';

@Injectable()
export class ChatProcessor {
  constructor(
    @Inject(DataSource) private readonly _ds: DataSource,
    @Inject(RoomProcessor) private readonly roomProcessor: RoomProcessor,
    @Inject(UserProcessor) private readonly userProcessor: UserProcessor,
    @Inject(MessageProcessor) private readonly messageProcessor: MessageProcessor,
    @Inject(FileProcessor) private readonly fileProcessor: FileProcessor,
    @Inject(UserMessageProcessor) private readonly userMessageProcessor: UserMessageProcessor
  ) {
    this._ds;
  }

  async roomCreate(payload: RoomCreate): Promise<Room> {
    const room = await this.roomProcessor.create(payload);
    if (payload.userIds)
      await this.userProcessor.add(room.id, payload.userIds);

    return room;
  }

  async roomUpdate(payload: RoomUpdate): Promise<Room> {
    return this.roomProcessor.update(payload.roomId, payload);
  }

  async roomDelete(payload: RoomDelete): Promise<void> {
    await this.roomProcessor.delete(payload.roomId);
  }

  async userAdd(payload: UserAdd): Promise<void> {
    await this.userProcessor.add(payload.roomId, payload.userIds);
    const messageIds = await this.messageProcessor.list(payload.roomId, null);
    await this.userMessageProcessor.create(payload.roomId, payload.userIds, messageIds.map( message => message.id ));
  }

  async userRemove(payload: UserRemove): Promise<void> {
    await this.userProcessor.remove(payload.roomId, payload.userIds);
  }

  async messageCreate(payload: MessageCreate): Promise<Message> {
    const message = await this.messageProcessor.create(payload);
    const users = await this.userProcessor.list(payload.roomId);
    await this.userMessageProcessor.create(payload.roomId, users.map( user => user.userId ), [message.id]);

    if (payload.files)
      await this.fileProcessor.create(payload.files.map( file => {
        return {
          roomId: payload.roomId,
          messageId: message.id,
          fileId: file.id,
        };
      }));

    return message;
  }

  async messageEdit(payload: MessageEdit): Promise<Message> {
    const message = await this.messageProcessor.update(payload.roomId, payload.messageId, payload);

    // TODO add file processor
    // if (payload.files)
    //   await this.fileProcessor.create(payload)
    return message;
  }

  async messageDelete(payload: MessageDelete): Promise<void> {
    const files = await this.fileProcessor.listByMessage(payload.messageId, undefined);
    if (files)
      await this.fileProcessor.delete(payload.roomId, payload.messageId, files.map( file => file.id ));
    await this.messageProcessor.delete(payload.roomId, payload.messageId);
  }

  async userMessageDeliver(payload: UserMessageDeliver): Promise<void> {
    await this.userMessageProcessor.deliver([payload.roomId], [payload.userId], payload.messageIds);
  }

  async userMessageRead(payload: UserMessageRead): Promise<void> {
    await this.userMessageProcessor.read([payload.roomId], [payload.userId], payload.messageIds);
  }

  async userMessageDelete(payload: UserMessageDelete): Promise<void> {
    await this.userMessageProcessor.delete([payload.roomId], [payload.userId], payload.messageIds);
  }
}
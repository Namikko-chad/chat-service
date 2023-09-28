import { Inject, Injectable, } from '@nestjs/common';
import { EventEmitter2, } from '@nestjs/event-emitter';
import { DataSource, In, OrderByCondition, } from 'typeorm';

import { Exception, Utils, } from '../utils';
import { Errors, ErrorsMessages, MessageStatus, } from './chats.enum';
import { 
  MessageCreate, 
  MessageEdit, 
  MessageRetrieve, 
  RoomCreate, 
  RoomDelete, 
  RoomList, 
  RoomRetrieve, 
  RoomUpdate, 
  UserAdd, 
  UserMessageDelete, 
  UserMessageDeliver, 
  UserMessageRead, 
  UserRemove, } from './chats.interfaces';
import { ChatProcessor, } from './chats.processor';
import { File, } from './entities/File.entity';
import { Message, } from './entities/Message.entity';
import { Room, } from './entities/Room.entity';
import { User, } from './entities/User.entity';
import { UserMessage, } from './entities/UserMessage.entity';
import { Event, } from './events';

@Injectable()
export class ChatService {
  constructor(
    @Inject(DataSource) private readonly ds: DataSource,
    @Inject(EventEmitter2) private readonly event: EventEmitter2,
    @Inject(ChatProcessor) private readonly _processor: ChatProcessor
  ) {

  }

  private async userInRoom(userId: string, roomId: string): Promise<boolean> {
    const userCheck = await this.ds.createQueryBuilder().select().from(User, 'user').where({
      roomId,
      userId,
    }).getExists();

    if (!userCheck)
      throw new Exception(Errors.RoomNotFound, ErrorsMessages[Errors.RoomNotFound], {
        roomId,
      });

    return userCheck;
  }
  
  async roomList(payload: RoomList): Promise<[Room[], number]> {
    const params = Utils.listParam<Room>(payload.listParam, ['name']);
    const rooms = await this.ds.createQueryBuilder().select()
      .addSelect('room.id', 'id')
      .addSelect('room.name', 'name')
      .addSelect('room.iconId', 'iconId')
      .addSelect('room."createdAt"', 'createdAt')
      .addSelect('room."updatedAt"', 'updatedAt')
      .addSelect('(SELECT count(id) FROM chat."Users" WHERE "roomId" = room.id) :: INTEGER', 'usersCount')
      .addSelect('(SELECT count(id) FROM chat."Messages" WHERE "roomId" = room.id) :: INTEGER', 'messagesCount')
      .addSelect(`(SELECT count(id) FROM chat."UserMessages" 
        WHERE "roomId" = room.id AND "userId" = '${payload.userId}' AND status = '${MessageStatus.Delivered}') :: INTEGER`, 'unreadMessagesCount')
      .innerJoin(User, 'users', '"roomId" = room.id AND users."userId" = :userId', { userId: payload.userId, })
      .from(Room, 'room')
      .where(params.where)
      .offset(params.skip)
      .limit(params.take)
      .orderBy(params.order as OrderByCondition)
      .getRawMany<Room>();
    const count = await this.ds.createQueryBuilder().select().from(Room, 'room').where(params.where).getCount();
    await Promise.all(
      rooms.map( async (room) => {
        const users = await this.ds.createQueryBuilder().select('"userId"')
          .from(User, 'user')
          .where({
            roomId: room.id,
          }).getRawMany<User>();
        room.users = users;
      })
    );

    return [rooms, count];
  }

  async roomCreate(payload: RoomCreate): Promise<Room> {
    const room = await this._processor.roomCreate({
      ...payload,
      userIds: [payload.userId].concat(payload.userIds ?? []),
    });
    
    this.event.emit(Event.RoomCreated, {
      roomId: room.id,
    });

    return this.roomRetrieve({
      roomId: room.id,
      userId: payload.userId,
    });
  }

  async roomRetrieve(payload: RoomRetrieve): Promise<Room> {
    await this.userInRoom(payload.userId, payload.roomId);

    const room = await this.ds.createQueryBuilder().select([
      'id',
      'name',
      '"iconId"',
      '"createdAt"',
      '"updatedAt"'
    ])
      .addSelect('(SELECT count(id) FROM "Users" WHERE "roomId" = room.id) :: INTEGER', 'usersCount')
      .addSelect('(SELECT count(id) FROM "Messages" WHERE "roomId" = room.id) :: INTEGER', 'messagesCount')
      .addSelect(`(SELECT count(id) FROM "UserMessages" 
        WHERE "roomId" = room.id AND "userId" = '${payload.userId}' AND status = '${MessageStatus.Delivered}') :: INTEGER`, 'unreadMessagesCount')
      .from(Room, 'room')
      .where({
        id: payload.roomId,
      }).getRawOne<Room>();
    const users = await this.ds.createQueryBuilder().select('"userId"')
      .from(User, 'user')
      .where({
        roomId: room.id,
      }).getRawMany<User>();
    room.users = users;
    const files = await this.ds.createQueryBuilder().select()
      .from(File, 'file')
      .where({
        roomId: room.id,
      }).getRawMany<File>();
    room.files = files;

    return room;
  }

  async roomUpdate(payload: RoomUpdate): Promise<Room> {
    await this.userInRoom(payload.userId, payload.roomId);

    await this._processor.roomUpdate(payload);
    
    this.event.emit(Event.RoomUpdated, {
      roomId: payload.roomId,
    });

    return this.roomRetrieve(payload);
  }

  async roomDelete(payload: RoomDelete): Promise<void> {
    await this.userInRoom(payload.userId, payload.roomId);
    
    this.event.emit(Event.RoomDeleted, {
      roomId: payload.roomId,
    });

    return this._processor.roomDelete(payload);
  }

  async messageRetrieve(payload: MessageRetrieve): Promise<[Message[], number]> {
    await this.userInRoom(payload.userId, payload.roomId);

    const params = Utils.listParam<Message>(payload.listParam, ['message']);
    Object.assign(params.where, { roomId: payload.roomId, userId: payload.userId, });
    const messages = await this.ds.createQueryBuilder().select()
      .from(Message, 'message')
      .innerJoin(UserMessage, 'um', `message.id = um."messageId" AND um.status != '${MessageStatus.Deleted}'`)
      .addSelect('message.id', 'id')
      .addSelect('message.message', 'message')
      .addSelect('message.createdAt', 'createdAt')
      .addSelect('message.updatedAt', 'updatedAt')
      .addSelect('message.edited', 'edited')
      .addSelect('um.status', 'status')
      .where(params.where)
      .offset(params.skip)
      .limit(params.take)
      .orderBy(params.order as OrderByCondition)
      .getRawMany<Message>();
    
    const count = await this.ds.createQueryBuilder().select().from(Message, 'message')
      .innerJoin(UserMessage, 'um', `message.id = um."messageId" AND um.status != '${MessageStatus.Deleted}'`)
      .where(params.where)
      .getCount();

    return [messages, count];
  }

  async messageCreate(payload: MessageCreate): Promise<Message> {
    await this.userInRoom(payload.userId, payload.roomId);

    const message = await this._processor.messageCreate(payload);

    this.event.emit(Event.MessageCreated, {
      roomId: payload.roomId,
      messageId: message.id,
    });

    return message;
  }

  async messageEdit(payload: MessageEdit): Promise<Message> {
    await this.userInRoom(payload.userId, payload.roomId);

    const message = await this._processor.messageEdit(payload);

    this.event.emit(Event.MessageEdited, {
      roomId: payload.roomId,
      messageId: payload.messageId,
    });

    return message;
  }

  async messageDeliver(payload: UserMessageDeliver): Promise<void> {
    this.event.emit(Event.MessageDelivered, {
      roomId: payload.roomId,
      messageIds: payload.messageIds,
    });

    return this._processor.userMessageDeliver(payload);
  }

  async messageRead(payload: UserMessageRead): Promise<void> {
    this.event.emit(Event.MessageRead, {
      roomId: payload.roomId,
      messageIds: payload.messageIds,
    });

    return this._processor.userMessageRead(payload);
  }

  async messageDelete(payload: UserMessageDelete): Promise<void> {
    this.event.emit(Event.MessageDeleted, {
      roomId: payload.roomId,
      messageIds: payload.messageIds,
    });
    
    if (payload.forAll) {
      await this.ds.createQueryBuilder().update(UserMessage)
        .set({
          status: MessageStatus.Deleted,
        })
        .where({
          roomId: payload.roomId,
          messageId: In(payload.messageIds),
        }).execute();
    } else {
      await this._processor.userMessageDelete(payload);
    }
  }

  async userAdd(payload: UserAdd): Promise<void> {
    await this.userInRoom(payload.userId, payload.roomId);

    await this._processor.userAdd(payload);

    this.event.emit(Event.UserAdded, {
      roomId: payload.roomId,
      userIds: payload.userIds,
    });
  }

  async userRemove(payload: UserRemove): Promise<void> {
    await this.userInRoom(payload.userId, payload.roomId);
      
    await this._processor.userRemove(payload);

    this.event.emit(Event.UserRemoved, {
      roomId: payload.roomId,
      userIds: payload.userIds,
    });
  }
}
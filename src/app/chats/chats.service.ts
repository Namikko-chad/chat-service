import { Inject, Injectable, } from '@nestjs/common';
import { DataSource, } from 'typeorm';

import { Exception, Utils, } from 'app/utils';

import { ListDto, } from '../dto';
import { Errors, ErrorsMessages, MessageStatus, } from './chats.enum';
import { ChatProcessor, } from './chats.processor';
import { RoomCreateDto, RoomUpdateDto, } from './dto/room.dto';
import { Room, } from './entities/Room.entity';
import { User, } from './entities/User.entity';
import { UserMessage, } from './entities/UserMessage.entity';

@Injectable()
export class ChatService {
  constructor(
    @Inject(DataSource) private readonly ds: DataSource,
    @Inject(ChatProcessor) private readonly _processor: ChatProcessor
  ) {

  }

  private async userInRoom(userId: string, roomId: string): Promise<boolean> {
    const userCheck = await this.ds.createQueryBuilder().select().from(User, 'user').where({
      roomId,
      userId,
    }).getExists();

    return userCheck;
  }
  
  async getRoomList(userId: string, listDto: ListDto<Room>): Promise<[Room[], number]> {
    const params = Utils.listParam<Room>(listDto, ['name']);
    // const res = await this.ds.getRepository(Room).findAndCount(params);
    const rooms = await this.ds.createQueryBuilder().select([
      'id',
      'name',
      '"iconId"',
      '"createdAt"',
      '"updatedAt"'
    ])
      .addSelect('(SELECT count(id) FROM "Users" WHERE "roomId" = room.id)', 'usersCount')
      .addSelect('(SELECT count(id) FROM "Messages" WHERE "roomId" = room.id)', 'messagesCount')
      .innerJoin(User, 'users', 'users.id = :userId', { userId, })
      .from(Room, 'room')
      .where(params.where)
      .offset(params.skip)
      .limit(params.take)
      // TODO make order parser
      // .orderBy(params.order)
      .getRawMany<Room>();
    const count = await this.ds.createQueryBuilder().select().from(Room, 'room').where(params.where).getCount();
    await Promise.all(
      rooms.map( async (room) => {
        const users = await this.ds.createQueryBuilder().select()
          .from(User, 'user')
          .where({
            roomId: room.id,
          }).getMany();
        const unreadMessagesCount = await this.ds.createQueryBuilder().select().from(UserMessage, 'um').where({
          roomId: room.id,
          userId,
          status: MessageStatus.Delivered,
        }).getCount();
        room.users = users;
        room.unreadMessagesCount = unreadMessagesCount;
      })
    );

    return [rooms, count];
  }

  async createRoom(userId: string, payload: RoomCreateDto): Promise<Room> {
    const room = await this._processor.roomCreate({
      ...payload,
      userIds: [userId].concat(payload.userIds ?? []),
    });

    return this.getRoom(userId, room.id);
  }

  async getRoom(userId: string, roomId: string): Promise<Room> {
    const userCheck = await this.userInRoom(userId, roomId);

    if (!userCheck)
      throw new Exception(Errors.RoomNotFound, ErrorsMessages[Errors.RoomNotFound], {
        roomId,
      });

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
        WHERE "roomId" = room.id AND "userId" = '${userId}' AND status = '${MessageStatus.Delivered}') :: INTEGER`, 'unreadMessagesCount')
      .from(Room, 'room')
      .where({
        id: roomId,
      }).getRawOne<Room>();
    const users = await this.ds.createQueryBuilder().select('"userId"')
      .from(User, 'user')
      .where({
        roomId: room.id,
      }).getRawMany<User>();
    room.users = users;

    return room;
  }

  async updateRoom(userId: string, roomId: string, payload: RoomUpdateDto): Promise<Room> {
    const userCheck = await this.userInRoom(userId, roomId);

    if (!userCheck)
      throw new Exception(Errors.RoomNotFound, ErrorsMessages[Errors.RoomNotFound], {
        roomId,
      });

    await this._processor.roomUpdate({
      ...payload,
      roomId,
    });

    return this.getRoom(userId, roomId);
  }

  async deleteRoom(userId: string, roomId: string): Promise<void> {
    return this._processor.userRemove({
      roomId,
      userIds: [userId],
    });
  }
}
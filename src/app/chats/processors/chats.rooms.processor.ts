import { Inject, Injectable, } from '@nestjs/common';
import { DataSource, DeepPartial, Repository, } from 'typeorm';

import { Exception, } from '../../utils';
import { Errors, ErrorsMessages, } from '../chats.enum';
import { Room, } from '../entities/Room.entity';
import { User, } from '../entities/User.entity';

@Injectable()
export class RoomProcessor {
  private readonly _repository: Repository<Room>;
  
  constructor(@Inject(DataSource) private readonly _ds: DataSource) {
    this._repository = this._ds.getRepository(Room);
  };

  async get(roomId: string): Promise<Room> {
    const usersCountQuery = '(SELECT count(id) FROM "Users" WHERE "roomId" = room.id)';
    const messagesCountQuery = '(SELECT count(id) FROM "Messages" WHERE "roomId" = room.id)';
    const room = await this._ds.createQueryBuilder().select([
      'id',
      'name',
      '"iconId"',
      '"createdAt"',
      '"updatedAt"'
    ])
      .addSelect(usersCountQuery, 'usersCount')
      .addSelect(messagesCountQuery, 'messagesCount')
      .from(Room, 'room').where({ id: roomId, })
      // .innerJoinAndSelect('room.users', 'users')
      .getRawOne<Room>();
    const users = await this._ds.createQueryBuilder().select()
      .from(User, 'user')
      .where({
        roomId,
      }).getMany();
    room.users = users;

    return room;
  }

  async create(property: DeepPartial<Room>): Promise<Room> {
    const room = this._repository.create(property);

    return this._repository.save(room);
  }

  async update(roomId: string, property: DeepPartial<Room>): Promise<Room> {
    const room = await this._repository.findOneBy({
      id: roomId,
    });
    if (!room)
      throw new Exception(Errors.RoomNotFound, ErrorsMessages[Errors.RoomNotFound], {
        roomId,
      });

    room.name = property.name || room.name;
    room.iconId = property.iconId;

    return this._repository.save(room);
  }

  async delete(roomId: string): Promise<void> {
    await this._repository.delete({
      id: roomId,
    });
  }
}
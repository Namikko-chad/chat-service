import { DataSource, } from 'typeorm';

import { afterAll, beforeAll, describe, expect, it, } from '@jest/globals';

import { CustomNamingStrategy, } from '../../database';
import { Utils, } from '../../utils';
import { File, } from '../entities/File.entity';
import { Message, } from '../entities/Message.entity';
import { Room, } from '../entities/Room.entity';
import { User, } from '../entities/User.entity';
import { UserMessage, } from '../entities/UserMessage.entity';
import { RoomGenerator, } from '../generators/Room.generator';
import { RoomProcessor, } from './chats.rooms.processor';
import { UserProcessor, } from './chats.users.processor';

describe('UserProcessor', () => {
  const dataSource = new DataSource({
    namingStrategy: new CustomNamingStrategy(),
    type: 'sqlite',
    database: ':memory:',
    entities: [Room, Message, File, User, UserMessage],
    synchronize: true,
  });
  const processor = new UserProcessor(dataSource);
  const roomProcessor = new RoomProcessor(dataSource);
  const roomGenerator = new RoomGenerator(dataSource);

  let room: Room;

  beforeAll(async () => {
    await dataSource.initialize();
    room = await roomGenerator.create();
  });

  afterAll(async () => {
    await dataSource.destroy();
  });

  describe('Work with users', () => {
    it('add user to room', async () => {
      await expect(processor.add(room.id, [
        Utils.getUUID(),
        Utils.getUUID()
      ])).resolves.not.toThrow();
      room = await roomProcessor.get(room.id);
      expect(room.usersCount).toBe(2);
    });

    it('should delete user from room', async () => {
      await expect(processor.remove(room.id, room.users.map( user => user.id ))).resolves.not.toThrow();
      room = await roomProcessor.get(room.id);
      expect(room.usersCount).toBe(0);
    });
  });
});
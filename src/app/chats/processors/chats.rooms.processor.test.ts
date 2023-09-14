import { DataSource, } from 'typeorm';

import { afterAll, beforeAll, describe, expect, it, } from '@jest/globals';

import { CustomNamingStrategy, } from '../../database/CustomNamingStrategy';
import { File, } from '../entities/File.entity';
import { Message, } from '../entities/Message.entity';
import { Room, } from '../entities/Room.entity';
import { User, } from '../entities/User.entity';
import { UserMessage, } from '../entities/UserMessage.entity';
import { RoomProcessor, } from './chats.rooms.processor';

describe('RoomProcessor', () => {
  const dataSource = new DataSource({
    namingStrategy: new CustomNamingStrategy(),
    type: 'sqlite',
    database: ':memory:',
    entities: [Room, Message, File, User, UserMessage],
    synchronize: true,
  });
  const processor = new RoomProcessor(dataSource);

  beforeAll(async () => {
    await dataSource.initialize();
  });

  afterAll(async () => {
    await dataSource.destroy();
  });

  describe('Work with room', () => {
    let room: Room;

    it('should create room', async () => {
      room = await processor.create({
        name: 'testRoom',
      });
      expect(room.name).toBe('testRoom');
    });

    it('should get created room', async () => {
      room = await processor.get(room.id);
      expect(room.name).toBe('testRoom');
    });

    it('should update room', async () => {
      room = await processor.update(room.id, {
        name: 'updatedRoom',
      });
      expect(room.name).toBe('updatedRoom');
    });

    it('should delete room', async () => {
      await expect(processor.delete(room.id)).resolves.not.toThrow();
    });
  });
});

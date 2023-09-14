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
import { MessageProcessor, } from './chats.messages.processor';

describe('RoomProcessor', () => {
  const dataSource = new DataSource({
    namingStrategy: new CustomNamingStrategy(),
    type: 'sqlite',
    database: ':memory:',
    entities: [Room, Message, File, User, UserMessage],
    synchronize: true,
  });
  const processor = new MessageProcessor(dataSource);
  const roomGenerator = new RoomGenerator(dataSource);

  let room: Room;

  beforeAll(async () => {
    await dataSource.initialize();
    room = await roomGenerator.create();
  });

  afterAll(async () => {
    await dataSource.destroy();
  });

  describe('Work with message', () => {
    let message: Message;

    it('should create message', async () => {
      message = await processor.create({
        roomId: room.id,
        userId: Utils.getUUID(),
        message: 'testMessage',
      });
      expect(message.message).toBe('testMessage');
    });

    it('should get created message', async () => {
      message = await processor.get(message.id);
      expect(message.message).toBe('testMessage');
    });

    it('should update message', async () => {
      message = await processor.update(room.id, message.id, {
        message: 'updatedMessage',
      });
      expect(message.message).toBe('updatedMessage');
    });

    it('should delete message', async () => {
      await expect(processor.delete(room.id, message.id)).resolves.not.toThrow();
    });
  });
});
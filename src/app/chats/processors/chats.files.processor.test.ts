import { DataSource, } from 'typeorm';

import { afterAll, beforeAll, describe, expect, it, } from '@jest/globals';

import { CustomNamingStrategy, } from '../../database';
import { Utils, } from '../../utils';
import { File, } from '../entities/File.entity';
import { Message, } from '../entities/Message.entity';
import { Room, } from '../entities/Room.entity';
import { User, } from '../entities/User.entity';
import { UserMessage, } from '../entities/UserMessage.entity';
import { MessageGenerator, } from '../generators/Message.generator';
import { RoomGenerator, } from '../generators/Room.generator';
import { FileProcessor, } from './chats.files.processor';

describe('FileProcessor', () => {
  const dataSource = new DataSource({
    namingStrategy: new CustomNamingStrategy(),
    type: 'sqlite',
    database: ':memory:',
    entities: [Room, Message, File, User, UserMessage],
    synchronize: true,
  });
  const processor = new FileProcessor(dataSource);
  const roomGenerator = new RoomGenerator(dataSource);
  const messageGenerator = new MessageGenerator(dataSource);

  let room: Room;
  let message: Message;

  beforeAll(async () => {
    await dataSource.initialize();
    room = await roomGenerator.create();
    message = await messageGenerator.create(
      {
        roomId: room.id,
        userId: Utils.getUUID(),
      }
    );
  });

  afterAll(async () => {
    await dataSource.destroy();
  });

  describe('Work with files', () => {
    let files: File[];

    it('should create file', async () => {
      files = await processor.create([{
        roomId: room.id,
        messageId: message.id,
        fileId: Utils.getUUID(),
      }]);
      expect(files).toHaveLength(1);
    });

    it('should delete file', async () => {
      await expect(processor.delete(room.id, message.id, files.map( file => file.id ))).resolves.not.toThrow();
    });
  });
});
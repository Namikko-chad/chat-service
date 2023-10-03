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
        meta: {
          id: '0c35aba6-c092-4096-ae1d-74d41024269c',
          name: 'PassportGG (Estimation).pdf',
          ext: 'pdf',
          mime: 'application/pdf',
          size: 4547842,
          public: false,
          userId: 'f5c5fc7e-9e69-4537-9c9a-5f0046cd6ab3',
          hash: '1d4b44a57a754bb7999ae3d6ec6fcfb5',
        },
        fileId: Utils.getUUID(),
      }]);
      expect(files).toHaveLength(1);
    });

    it('should delete file', async () => {
      await expect(processor.delete(room.id, message.id, files.map( file => file.id ))).resolves.not.toThrow();
    });
  });
});
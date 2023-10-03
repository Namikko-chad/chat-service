import { DataSource, } from 'typeorm';

import { afterAll, beforeAll, describe, expect, it, } from '@jest/globals';

import { CustomNamingStrategy, } from '../../database';
import { Utils, } from '../../utils';
import { MessageStatus, } from '../chats.enum';
import { File, } from '../entities/File.entity';
import { Message, } from '../entities/Message.entity';
import { Room, } from '../entities/Room.entity';
import { User, } from '../entities/User.entity';
import { UserMessage, } from '../entities/UserMessage.entity';
import { MessageGenerator, } from '../generators/Message.generator';
import { RoomGenerator, } from '../generators/Room.generator';
import { UserMessageGenerator, } from '../generators/UserMessage.generator';
import { UserMessageProcessor, } from './chats.user-messages.processor';

describe('RoomProcessor', () => {
  const dataSource = new DataSource({
    namingStrategy: new CustomNamingStrategy(),
    type: 'sqlite',
    database: ':memory:',
    entities: [Room, Message, File, User, UserMessage],
    synchronize: true,
  });
  const processor = new UserMessageProcessor(dataSource);
  const roomGenerator = new RoomGenerator(dataSource);
  const messageGenerator = new MessageGenerator(dataSource);
  const userMessageGenerator = new UserMessageGenerator(dataSource);

  let room: Room;
  let message: Message;
  let userMessage: UserMessage;
  const userId = Utils.getUUID();

  beforeAll(async () => {
    await dataSource.initialize();
    room = await roomGenerator.create();
    message = await messageGenerator.create({
      roomId: room.id,
      userId,
    });
    userMessage = await userMessageGenerator.create({
      roomId: room.id,
      messageId: message.id,
      userId,
    });
  });

  afterAll(async () => {
    await dataSource.destroy();
  });

  describe('Work with user message status', () => {
    it('should create status records for new user', async () => {
      const userId = Utils.getUUID();
      await expect(processor.create(room.id, [userId], [message.id])).resolves.not.toThrow();
      userMessage = await processor.get(room.id, userId, message.id);
      expect(userMessage.status).toBe(MessageStatus.New);
    });

    it('should set delivered status', async () => {
      await expect(processor.deliver([room.id], [userId], [message.id])).resolves.not.toThrow();
      userMessage = await processor.get(room.id, userId, message.id);
      expect(userMessage.status).toBe(MessageStatus.Delivered);
    });

    it('should set read message', async () => {
      await expect(processor.read([room.id], [userId], [message.id])).resolves.not.toThrow();
      userMessage = await processor.get(room.id, userId, message.id);
      expect(userMessage.status).toBe(MessageStatus.Read);
    });

    it('should set deleted status', async () => {
      await expect(processor.delete([room.id], [userId], [message.id])).resolves.not.toThrow();
      userMessage = await processor.get(room.id, userId, message.id);
      expect(userMessage.status).toBe(MessageStatus.Deleted);
    });
  });
});
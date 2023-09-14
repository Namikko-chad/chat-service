import { DataSource, } from 'typeorm';

import { afterAll, beforeAll, describe, expect, it, } from '@jest/globals';

import { CustomNamingStrategy, } from '../database/CustomNamingStrategy';
import { Utils, } from '../utils';
import { MessageStatus, } from './chats.enum';
import { ChatProcessor, } from './chats.processor';
import { File, } from './entities/File.entity';
import { Message, } from './entities/Message.entity';
import { Room, } from './entities/Room.entity';
import { User, } from './entities/User.entity';
import { UserMessage, } from './entities/UserMessage.entity';
import { RoomGenerator, } from './generators/Room.generator';
import { MessageProcessor, } from './processors/chats.messages.processor';
import { RoomProcessor, } from './processors/chats.rooms.processor';
import { UserMessageProcessor, } from './processors/chats.user-messages.processor';
import { UserProcessor, } from './processors/chats.users.processor';

describe('ChatProcessor', () => {
  const dataSource = new DataSource({
    namingStrategy: new CustomNamingStrategy(),
    type: 'sqlite',
    database: ':memory:',
    entities: [Room, Message, File, User, UserMessage],
    synchronize: true,
  });
  const roomProcessor = new RoomProcessor(dataSource);
  const userProcessor = new UserProcessor(dataSource);
  const messageProcessor = new MessageProcessor(dataSource);
  const userMessageProcessor = new UserMessageProcessor(dataSource);
  const processor = new ChatProcessor(dataSource, roomProcessor, userProcessor, messageProcessor, userMessageProcessor);
  const roomGenerator = new RoomGenerator(dataSource);

  beforeAll(async () => {
    await dataSource.initialize();
  });

  afterAll(async () => {
    await dataSource.destroy();
  });

  describe('Work with room', () => {
    let room: Room;

    it('should create room', async () => {
      room = await processor.roomCreate({
        name: 'testRoom',
      });
      expect(room.name).toBe('testRoom');
    });

    it('should update room', async () => {
      room = await processor.roomUpdate({
        roomId: room.id,
        name: 'updatedRoom',
      });
      expect(room.name).toBe('updatedRoom');
    });

    it('should delete room', async () => {
      await expect(processor.roomDelete({ roomId: room.id, })).resolves.not.toThrow();
    });

  });

  describe('Work with users', () => {
    let room: Room;
    const userIds = [
      Utils.getUUID(),
      Utils.getUUID()
    ];

    beforeAll(async () => {
      room = await roomGenerator.create();
    });

    it('should added user to room', async () => {
      await expect(processor.userAdd({
        roomId: room.id,
        userIds,
      })).resolves.not.toThrow();
      room = await roomProcessor.get(room.id);
      expect(room.usersCount).toBe(2);
    });

    it('should remove user from room', async () => {
      await expect(processor.userRemove({
        roomId: room.id,
        userIds,
      })).resolves.not.toThrow();
      room = await roomProcessor.get(room.id);
      expect(room.usersCount).toBe(0);
    });
  });

  describe('Work with messages', () => {
    let room: Room;
    let message: Message;
    const userIds = [
      Utils.getUUID(),
      Utils.getUUID()
    ];

    beforeAll(async () => {
      room = await roomGenerator.create();
      await processor.userAdd({
        roomId: room.id,
        userIds,
      });
    });

    it('should create message', async () => {
      message = await processor.messageCreate({
        roomId: room.id,
        userId: userIds[0],
        message: 'TestMessage',
      });
      room = await roomProcessor.get(room.id);
      expect(room.messagesCount).toBe(1);
    });

    it('should update message', async () => {
      message = await processor.messageUpdate({
        roomId: room.id,
        userId: userIds[0],
        messageId: message.id, 
        message: 'TestMessage',
      });
      expect(message.message).toBe('TestMessage');
      expect(message.edited).toBe(true);
      room = await roomProcessor.get(room.id);
      expect(room.messagesCount).toBe(1);
    });

    it('should delete message', async () => {
      await expect(processor.messageDelete({
        roomId: room.id,
        userId: userIds[0],
        messageId: message.id, 
      })).resolves.not.toThrow();
      room = await roomProcessor.get(room.id);
      expect(room.messagesCount).toBe(0);
    });
  });

  describe('Work with user messages status', () => {
    let room: Room;
    let message: Message;
    const userIds = [
      Utils.getUUID(),
      Utils.getUUID()
    ];

    beforeAll(async () => {
      room = await roomGenerator.create();
      await processor.userAdd({
        roomId: room.id,
        userIds,
      });
      message = await processor.messageCreate({
        roomId: room.id,
        userId: userIds[0],
        message: 'TestMessage',
      });
    });

    it('should deliver message', async () => {
      await expect(processor.userMessageDeliver({
        roomId: room.id,
        userId: userIds[1],
        messageIds: [message.id], 
      })).resolves.not.toThrow();
      const userMessage = await userMessageProcessor.get(room.id, userIds[1], message.id);
      expect(userMessage.status).toBe(MessageStatus.Delivered);
    });

    it('should read message', async () => {
      await expect(processor.userMessageRead({
        roomId: room.id,
        userId: userIds[1],
        messageIds: [message.id], 
      })).resolves.not.toThrow();
      const userMessage = await userMessageProcessor.get(room.id, userIds[1], message.id);
      expect(userMessage.status).toBe(MessageStatus.Read);
    });

    it('should delete message', async () => {
      await expect(processor.userMessageDelete({
        roomId: room.id,
        userId: userIds[1],
        messageIds: [message.id], 
      })).resolves.not.toThrow();
      const userMessage = await userMessageProcessor.get(room.id, userIds[1], message.id);
      expect(userMessage.status).toBe(MessageStatus.Deleted);
    });
  });
});

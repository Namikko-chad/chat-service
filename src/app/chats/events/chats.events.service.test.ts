import { ConfigModule, ConfigService, } from '@nestjs/config';
import { DataSource, } from 'typeorm';

import { afterAll, beforeAll, describe, expect, it, } from '@jest/globals';

import { CustomNamingStrategy, } from '../../database';
import { Utils, } from '../../utils';
import { ChatConfig, } from '../chats.config';
import { Event, } from '../chats.enum';
import { File, } from '../entities/File.entity';
import { Message, } from '../entities/Message.entity';
import { Room, } from '../entities/Room.entity';
import { User, } from '../entities/User.entity';
import { UserMessage, } from '../entities/UserMessage.entity';
import { MessageGenerator, } from '../generators/Message.generator';
import { RoomGenerator, } from '../generators/Room.generator';
import { EventsService, } from './chats.events.service';

describe('ChatEvents', () => {
  const dataSource = new DataSource({
    namingStrategy: new CustomNamingStrategy(),
    type: 'sqlite',
    database: ':memory:',
    entities: [Room, Message, File, User, UserMessage],
    synchronize: true,
  });
  ConfigModule.forRoot();
  const configService = new ConfigService();
  const roomGenerator = new RoomGenerator(dataSource);
  const messageGenerator = new MessageGenerator(dataSource);
  const service = new EventsService();

  beforeAll(async () => {
    await dataSource.initialize();
  });

  afterAll(async () => {
    await dataSource.destroy();
  });

  describe('Generate events', () => {
    let roomId: string;
    let userId: string;
    let messageId: string;

    beforeAll(async () => {
      userId = Utils.getUUID();
      const room = await roomGenerator.create();
      roomId = room.id;
      const message = await messageGenerator.create({
        roomId,
        userId,
      });
      messageId = message.id;
    });

    it(`event ${Event.RoomCreated}`, async () => {
      await expect(service.handlerRoomCreatedEvent({ roomId, })).resolves.not.toThrow();
    });

    it(`event ${Event.RoomUpdated}`, async () => {
      await expect(service.handlerRoomUpdatedEvent({ roomId, })).resolves.not.toThrow();
    });

    it(`event ${Event.RoomDeleted}`, async () => {
      await expect(service.handlerRoomDeletedEvent({ roomId, })).resolves.not.toThrow();
    });

    it(`event ${Event.UserAdded}`, async () => {
      await expect(service.handlerUserAddedEvent({ roomId, userId, })).resolves.not.toThrow();
    });

    it(`event ${Event.UserDeleted}`, async () => {
      await expect(service.handlerUserDeletedEvent({ roomId, userId, })).resolves.not.toThrow();
    });

    it(`event ${Event.MessageCreated}`, async () => {
      await expect(service.handlerMessageCreatedEvent({ roomId, userId, messageId, })).resolves.not.toThrow();
    });

    it(`event ${Event.MessageEdited}`, async () => {
      await expect(service.handlerMessageEditedEvent({ roomId, userId, messageId, })).resolves.not.toThrow();
    });

    it(`event ${Event.MessageDelivered}`, async () => {
      await expect(service.handlerMessageDeliveredEvent({ roomId, userId, messageId, })).resolves.not.toThrow();
    });

    it(`event ${Event.MessageRead}`, async () => {
      await expect(service.handlerMessageReadEvent({ roomId, userId, messageId, })).resolves.not.toThrow();
    });

    it(`event ${Event.MessageDeleted}`, async () => {
      await expect(service.handlerMessageDeletedEvent({ roomId, userId, messageId, })).resolves.not.toThrow();
    });

  });
});

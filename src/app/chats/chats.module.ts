import { Module, } from '@nestjs/common';
import { ConfigService, } from '@nestjs/config';
import { ClientProxy, } from '@nestjs/microservices';
import { TypeOrmModule, } from '@nestjs/typeorm';

import { AmqpClient, AmqpConfig, } from '../../amqp';
import { ChatConfig, } from './chats.config';
import { ChatHttpController, } from './chats.controller.http';
import { ChatMicroserviceController, } from './chats.controller.microservice';
import { ChatProcessor, } from './chats.processor';
import { ChatService, } from './chats.service';
import { File, } from './entities/File.entity';
import { Message, } from './entities/Message.entity';
import { Room, } from './entities/Room.entity';
import { User, } from './entities/User.entity';
import { UserMessage, } from './entities/UserMessage.entity';
import { ChatEventsService, } from './events/chats.events.service';
import { FileProcessor, } from './processors/chats.files.processor';
import { MessageProcessor, } from './processors/chats.messages.processor';
import { RoomProcessor, } from './processors/chats.rooms.processor';
import { UserMessageProcessor, } from './processors/chats.user-messages.processor';
import { UserProcessor, } from './processors/chats.users.processor';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      File,
      Message,
      Room,
      User,
      UserMessage
    ])
  ],
  controllers: [
    ChatHttpController,
    ChatMicroserviceController
  ],
  providers: [
    ConfigService,
    ChatConfig,
    {
      provide: ClientProxy,
      inject: [ConfigService],
      useFactory: (config: ConfigService) => new AmqpClient(new AmqpConfig(config, 'notifications', 'notifications-queue')),
    },
    RoomProcessor,
    UserProcessor,
    MessageProcessor,
    FileProcessor,
    UserMessageProcessor,
    ChatProcessor,
    ChatService,
    ChatEventsService
  ],
})
export class ChatModule {}

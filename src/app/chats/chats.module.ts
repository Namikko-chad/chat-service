import { Module, } from '@nestjs/common';
import { ConfigService, } from '@nestjs/config';
import { TypeOrmModule, } from '@nestjs/typeorm';

import { ChatConfig, } from './chats.config';
import { ChatController, } from './chats.controller';
import { ChatProcessor, } from './chats.processor';
import { ChatService, } from './chats.service';
import { File, } from './entities/File.entity';
import { Message, } from './entities/Message.entity';
import { Room, } from './entities/Room.entity';
import { User, } from './entities/User.entity';
import { UserMessage, } from './entities/UserMessage.entity';
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
    ChatController
  ],
  providers: [
    ConfigService,
    ChatConfig,
    RoomProcessor,
    UserProcessor,
    MessageProcessor,
    FileProcessor,
    UserMessageProcessor,
    ChatProcessor,
    ChatService
  ],
})
export class ChatModule {}

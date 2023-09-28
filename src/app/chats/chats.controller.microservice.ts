
import { Controller, Inject, UseInterceptors, UsePipes, ValidationPipe, } from '@nestjs/common';
import { MessagePattern, Payload, } from '@nestjs/microservices';

import { MicroserviceLoggingInterceptor, } from '../utils';
import { Flow, } from './chats.enum';
import { MessageCreate, MessageEdit, RoomCreate, RoomDelete, RoomUpdate, UserAdd, UserMessageDelete, UserRemove, } from './chats.interfaces';
import { ChatService, } from './chats.service';
import { Message, } from './entities/Message.entity';
import { Room, } from './entities/Room.entity';

@Controller()
@UseInterceptors(new MicroserviceLoggingInterceptor())
@UsePipes(new ValidationPipe({ transform: true, whitelist: true, forbidNonWhitelisted: true, }))
export class ChatMicroserviceController {
  @Inject(ChatService) private readonly _chatService: ChatService;

  /**
   * Room part
   */

  @MessagePattern(Flow.RoomCreate)
  async roomCreate(@Payload() payload: RoomCreate): Promise<Room> {
    return this._chatService.roomCreate(payload);
  }

  @MessagePattern(Flow.RoomUpdate)
  async roomUpdate(@Payload() payload: RoomUpdate): Promise<Room> {
    return this._chatService.roomUpdate(payload);
  }

  @MessagePattern(Flow.RoomDelete)
  async roomDelete(@Payload() payload: RoomDelete): Promise<void> {
    return this._chatService.roomDelete(payload);
  }

  /**
   * Message part
   */

  @MessagePattern(Flow.MessageCreate)
  async messageCreate(@Payload() payload: MessageCreate): Promise<Message> {
    return this._chatService.messageCreate(payload);
  }

  @MessagePattern(Flow.MessageEdit)
  async messageUpdate(@Payload() payload: MessageEdit): Promise<Message> {
    return this._chatService.messageEdit(payload);
  }

  @MessagePattern(Flow.MessageDelete)
  async messageDelete(@Payload() payload: UserMessageDelete): Promise<void> {
    return this._chatService.messageDelete(payload);
  }

  /**
   * User part
   */

  @MessagePattern(Flow.UserAdd)
  async userAdd(@Payload() payload: UserAdd): Promise<void> {
    return this._chatService.userAdd(payload);
  }

  @MessagePattern(Flow.UserRemove)
  async userRemove(@Payload() payload: UserRemove): Promise<void> {
    return this._chatService.userRemove(payload);
  }
}

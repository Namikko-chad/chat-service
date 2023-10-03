import { Inject, Injectable, Logger, } from '@nestjs/common';
import { OnEvent, } from '@nestjs/event-emitter';
import { ClientProxy, } from '@nestjs/microservices';

import { Channels, INotificationPayload, NotificationType, } from '../../dto';
import { ChatProcessor, } from '../chats.processor';
import { Event, } from './chats.events.enum';
import { MessageEvent, RoomEvent, UserEvent, } from './chats.events.interfaces';

@Injectable()
export class ChatEventsService {
  private readonly logger = new Logger(ChatEventsService.name);
  constructor(
    @Inject(ClientProxy) private readonly client: ClientProxy,
    @Inject(ChatProcessor) private readonly processor: ChatProcessor
  ) {}

  private emit(payload: INotificationPayload): void {
    this.client.emit('notifications', payload);
  }

  @OnEvent(Event.RoomCreated)
  async handlerRoomCreatedEvent(payload: RoomEvent): Promise<void> {
    const room = await this.processor.roomRetrieve(payload);
    this.logger.log(`New event: ${Event.RoomCreated}, param: ${JSON.stringify(payload)}`);
    this.emit({
      type: NotificationType.Chat,
      placeHolders: [room.name],
      data: {
        event: Event.RoomCreated,
        room,
      },
      destination: room.users.filter( user => user.userId !== payload.userId ).map( user => user.userId ),
      preferredChannel: Channels.WS,
    });
  }

  @OnEvent(Event.RoomUpdated)
  async handlerRoomUpdatedEvent(payload: RoomEvent): Promise<void> {
    this.logger.log(`New event: ${Event.RoomUpdated}, param: ${JSON.stringify(payload)}`);
    const room = await this.processor.roomRetrieve(payload);
    this.emit({
      type: NotificationType.Chat,
      placeHolders: [room.name],
      files: room.files.map( file => file.meta ),
      data: {
        event: Event.RoomUpdated,
        room,
      },
      destination: room.users.filter( user => user.userId !== payload.userId ).map( user => user.userId ),
      preferredChannel: Channels.WS,
    });
  }

  @OnEvent(Event.RoomDeleted)
  async handlerRoomDeletedEvent(payload: RoomEvent): Promise<void> {
    this.logger.log(`New event: ${Event.RoomDeleted}, param: ${JSON.stringify(payload)}`);
    const room = await this.processor.roomRetrieve(payload);
    // FIX ME: set correct destination
    this.emit({
      type: NotificationType.Chat,
      placeHolders: [room.name],
      data: {
        event: Event.RoomDeleted,
        room,
      },
      destination: room.users.filter( user => user.userId !== payload.userId ).map( user => user.userId ),
      preferredChannel: Channels.WS,
    });
  }

  @OnEvent(Event.MessageCreated)
  async handlerMessageCreatedEvent(payload: MessageEvent): Promise<void> {
    this.logger.log(`New event: ${Event.MessageCreated}, param: ${JSON.stringify(payload)}`);
    const room = await this.processor.roomRetrieve(payload);
    const message = await this.processor.messageRetrieve(payload);
    this.emit({
      type: NotificationType.Chat,
      message: message.message,
      files: message.files.map( file => file.meta ),
      data: {
        event: Event.MessageCreated,
        message,
      },
      destination: room.users.filter( user => user.userId !== message.userId ).map( user => user.userId ),
      preferredChannel: Channels.WS,
    });
  }

  @OnEvent(Event.MessageEdited)
  async handlerMessageEditedEvent(payload: MessageEvent): Promise<void> {
    this.logger.log(`New event: ${Event.MessageEdited}, param: ${JSON.stringify(payload)}`);
    const room = await this.processor.roomRetrieve(payload);
    const message = await this.processor.messageRetrieve(payload);
    this.emit({
      type: NotificationType.Chat,
      message: message.message,
      files: message.files.map( file => file.meta ),
      data: {
        event: Event.MessageEdited,
        message,
      },
      destination: room.users.filter( user => user.userId !== message.userId ).map( user => user.userId ),
      preferredChannel: Channels.WS,
    });
  }

  @OnEvent(Event.MessageDelivered)
  async handlerMessageDeliveredEvent(payload: MessageEvent): Promise<void> {
    this.logger.log(`New event: ${Event.MessageDelivered}, param: ${JSON.stringify(payload)}`);
    await Promise.resolve();
  }

  @OnEvent(Event.MessageRead)
  async handlerMessageReadEvent(payload: MessageEvent): Promise<void> {
    this.logger.log(`New event: ${Event.MessageRead}, param: ${JSON.stringify(payload)}`);
    await Promise.resolve();
  }

  @OnEvent(Event.MessageDeleted)
  async handlerMessageDeletedEvent(payload: MessageEvent): Promise<void> {
    this.logger.log(`New event: ${Event.MessageDeleted}, param: ${JSON.stringify(payload)}`);
    await Promise.resolve();
  }

  @OnEvent(Event.UserAdded)
  async handlerUserAddedEvent(payload: UserEvent): Promise<void> {
    this.logger.log(`New event: ${Event.UserAdded}, param: ${JSON.stringify(payload)}`);
    await Promise.resolve();
  }

  @OnEvent(Event.UserRemoved)
  async handlerUserDeletedEvent(payload: UserEvent): Promise<void> {
    this.logger.log(`New event: ${Event.UserRemoved}, param: ${JSON.stringify(payload)}`);
    await Promise.resolve();
  }
}
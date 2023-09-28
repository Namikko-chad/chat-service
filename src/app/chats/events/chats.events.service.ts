import { Inject, Injectable, Logger, } from '@nestjs/common';
import { OnEvent, } from '@nestjs/event-emitter';
import { ClientProxy, } from '@nestjs/microservices';

import { Event, } from './chats.events.enum';
import { MessageEvent, RoomEvent, UserEvent, } from './chats.events.interfaces';

@Injectable()
export class ChatEventsService {
  private readonly logger = new Logger(ChatEventsService.name);
  @Inject(ClientProxy) private readonly client: ClientProxy;

  @OnEvent(Event.RoomCreated)
  async handlerRoomCreatedEvent(payload: RoomEvent): Promise<void> {
    this.logger.log(`New event: ${Event.RoomCreated}, param: ${JSON.stringify(payload)}`);
    this.client.emit('notifications', payload);
    await Promise.resolve();
  }

  @OnEvent(Event.RoomUpdated)
  async handlerRoomUpdatedEvent(payload: RoomEvent): Promise<void> {
    this.logger.log(`New event: ${Event.RoomUpdated}, param: ${JSON.stringify(payload)}`);
    this.client.emit('notifications', payload);
    await Promise.resolve();
  }

  @OnEvent(Event.RoomDeleted)
  async handlerRoomDeletedEvent(payload: RoomEvent): Promise<void> {
    this.logger.log(`New event: ${Event.RoomDeleted}, param: ${JSON.stringify(payload)}`);
    this.client.emit('notifications', payload);
    await Promise.resolve();
  }

  @OnEvent(Event.UserAdded)
  async handlerUserAddedEvent(payload: UserEvent): Promise<void> {
    this.logger.log(`New event: ${Event.UserAdded}, param: ${JSON.stringify(payload)}`);
    this.client.emit('notifications', payload);
    await Promise.resolve();
  }

  @OnEvent(Event.UserRemoved)
  async handlerUserDeletedEvent(payload: UserEvent): Promise<void> {
    this.logger.log(`New event: ${Event.UserRemoved}, param: ${JSON.stringify(payload)}`);
    this.client.emit('notifications', payload);
    await Promise.resolve();
  }

  @OnEvent(Event.MessageCreated)
  async handlerMessageCreatedEvent(payload: MessageEvent): Promise<void> {
    this.logger.log(`New event: ${Event.MessageCreated}, param: ${JSON.stringify(payload)}`);
    this.client.emit('notifications', payload);
    await Promise.resolve();
  }

  @OnEvent(Event.MessageEdited)
  async handlerMessageEditedEvent(payload: MessageEvent): Promise<void> {
    this.logger.log(`New event: ${Event.MessageEdited}, param: ${JSON.stringify(payload)}`);
    this.client.emit('notifications', payload);
    await Promise.resolve();
  }

  @OnEvent(Event.MessageDelivered)
  async handlerMessageDeliveredEvent(payload: MessageEvent): Promise<void> {
    this.logger.log(`New event: ${Event.MessageDelivered}, param: ${JSON.stringify(payload)}`);
    this.client.emit('notifications', payload);
    await Promise.resolve();
  }

  @OnEvent(Event.MessageRead)
  async handlerMessageReadEvent(payload: MessageEvent): Promise<void> {
    this.logger.log(`New event: ${Event.MessageRead}, param: ${JSON.stringify(payload)}`);
    this.client.emit('notifications', payload);
    await Promise.resolve();
  }

  @OnEvent(Event.MessageDeleted)
  async handlerMessageDeletedEvent(payload: MessageEvent): Promise<void> {
    this.logger.log(`New event: ${Event.MessageDeleted}, param: ${JSON.stringify(payload)}`);
    this.client.emit('notifications', payload);
    await Promise.resolve();
  }
}
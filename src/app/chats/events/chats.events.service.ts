import { Injectable, } from '@nestjs/common';
import { OnEvent, } from '@nestjs/event-emitter';

import { Event, } from '../chats.enum';
import { MessageEvent, RoomEvent, UserEvent, } from './chats.events.interfaces';

@Injectable()
export class EventsService {
  @OnEvent(Event.RoomCreated)
  async handlerRoomCreatedEvent(_payload: RoomEvent): Promise<void> {
    await Promise.resolve();
  }

  @OnEvent(Event.RoomUpdated)
  async handlerRoomUpdatedEvent(_payload: RoomEvent): Promise<void> {
    await Promise.resolve();
  }

  @OnEvent(Event.RoomDeleted)
  async handlerRoomDeletedEvent(_payload: RoomEvent): Promise<void> {
    await Promise.resolve();
  }

  @OnEvent(Event.UserAdded)
  async handlerUserAddedEvent(_payload: UserEvent): Promise<void> {
    await Promise.resolve();
  }

  @OnEvent(Event.UserDeleted)
  async handlerUserDeletedEvent(_payload: UserEvent): Promise<void> {
    await Promise.resolve();
  }

  @OnEvent(Event.MessageCreated)
  async handlerMessageCreatedEvent(_payload: MessageEvent): Promise<void> {
    await Promise.resolve();
  }

  @OnEvent(Event.MessageEdited)
  async handlerMessageEditedEvent(_payload: MessageEvent): Promise<void> {
    await Promise.resolve();
  }

  @OnEvent(Event.MessageDelivered)
  async handlerMessageDeliveredEvent(_payload: MessageEvent): Promise<void> {
    await Promise.resolve();
  }

  @OnEvent(Event.MessageRead)
  async handlerMessageReadEvent(_payload: MessageEvent): Promise<void> {
    await Promise.resolve();
  }

  @OnEvent(Event.MessageDeleted)
  async handlerMessageDeletedEvent(_payload: MessageEvent): Promise<void> {
    await Promise.resolve();
  }
}
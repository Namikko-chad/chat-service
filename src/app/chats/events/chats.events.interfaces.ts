import { FileInfo, } from '../../dto';
import { Event, } from './chats.events.enum';

export interface RoomEvent {
  readonly roomId: string;
  readonly userId: string;
}

export interface MessageEvent {
  readonly roomId: string;
  readonly userId: string;
  readonly messageId: string;
}

export interface UserEvent {
  readonly roomId: string;
  readonly userId: string;
}

// Room views

export interface RoomCreateView {
  readonly roomId: string;
  readonly name: string;
  readonly iconId?: string;
  readonly userIds: readonly string[];
  readonly createdAt: string;
  readonly event: Event.RoomCreated;
}

export interface RoomUpdateView {
  readonly roomId: string;
  readonly name: string;
  readonly iconId?: string;
  readonly userIds: readonly string[];
  readonly event: Event.RoomUpdated;
}

export interface RoomDeleteView {
  readonly roomId: string;
  readonly event: Event.RoomDeleted;
}

// Message views

export interface MessageCreateView {
  readonly roomId: string;
  readonly messageId: string;
  readonly userId: string;
  readonly message: string;
  readonly createdAt: string;
  readonly updatedAt: string;
  readonly files?: readonly FileInfo[];
  readonly meta?: Record<string, unknown>;
  readonly event: Event.MessageCreated;
}

export interface MessageEditView {
  readonly roomId: string;
  readonly messageId: string;
  readonly userId: string;
  readonly message: string;
  readonly createdAt: string;
  readonly updatedAt: string;
  readonly files?: readonly FileInfo[];
  readonly meta?: Record<string, unknown>;
  readonly event: Event.MessageEdited;
}

export interface MessageDeliveredView {
  readonly roomId: string;
  readonly userId: string;
  readonly messageIds: readonly string[];
  readonly event: Event.MessageDelivered;
}

export interface MessageReadView {
  readonly roomId: string;
  readonly userId: string;
  readonly messageIds: readonly string[];
  readonly event: Event.MessageRead;
}

export interface MessageDeletedView {
  readonly roomId: string;
  readonly userId: string;
  readonly messageIds: readonly string[];
  readonly event: Event.MessageDelivered;
}

// User views

export interface UserAddView {
  readonly roomId: string;
  readonly name: string;
  readonly iconId?: string;
  readonly userIds: string[];
  readonly createdAt: string;
  readonly event: Event.UserAdded;
}

export interface UserDeleteView {
  readonly roomId: string;
  readonly event: Event.UserRemoved;
}
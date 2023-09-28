import { FileInfo, ListDto, } from '../dto';
import { Message, } from './entities/Message.entity';
import { Room, } from './entities/Room.entity';

export interface RoomList {
  readonly userId: string;
  readonly listParam: ListDto<Room>;
}

export interface RoomCreate {
  readonly userId: string;
  readonly name?: string;
  readonly iconId?: string;
  readonly userIds?: string[];
}

export interface RoomRetrieve {
  readonly roomId: string;
  readonly userId: string;
}

export interface RoomUpdate {
  readonly roomId: string;
  readonly userId: string;
  readonly name?: string;
  readonly iconId?: string;
}

export interface RoomDelete {
  readonly roomId: string;
  readonly userId: string;
}

export interface MessageRetrieve {
  readonly roomId: string;
  readonly userId: string;
  readonly listParam: ListDto<Message>;
}

export interface MessageCreate {
  readonly roomId: string;
  readonly userId: string;
  readonly message?: string;
  readonly files?: FileInfo[];
}

export interface MessageEdit {
  readonly roomId: string;
  readonly userId: string;
  readonly messageId: string;
  readonly message?: string;
  readonly files?: FileInfo[];
}

export interface MessageDelete {
  readonly roomId: string;
  readonly userId: string;
  readonly messageId: string;
}

export interface UserAdd {
  readonly roomId: string;
  readonly userId: string;
  readonly userIds: string[];
  readonly messagesCount?: number;
}

export interface UserRemove {
  readonly roomId: string;
  readonly userId: string;
  readonly userIds: string[];
}

export interface UserMessageDeliver {
  readonly roomId: string;
  readonly userId: string;
  readonly messageIds: string[];
}

export interface UserMessageRead {
  readonly roomId: string;
  readonly userId: string;
  readonly messageIds: string[];
}

export interface UserMessageDelete {
  readonly roomId: string;
  readonly userId: string;
  readonly forAll: boolean;
  readonly messageIds: string[];
}


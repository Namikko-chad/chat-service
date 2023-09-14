import { FileInfo, } from 'app/dto';

export interface RoomCreate {
  readonly name?: string;
  readonly iconId?: string;
  readonly userIds?: string[];
}

export interface RoomUpdate {
  readonly roomId: string;
  readonly name?: string;
  readonly iconId?: string;
}

export interface RoomDelete {
  readonly roomId: string;
}

export interface UserAdd {
  readonly roomId: string;
  readonly userIds: string[];
  readonly messagesCount?: number;
}

export interface UserRemove {
  readonly roomId: string;
  readonly userIds: string[];
}

export interface MessageCreate {
  readonly roomId: string;
  readonly userId: string;
  readonly message: string;
  readonly files?: FileInfo[];
}

export interface MessageUpdate {
  readonly roomId: string;
  readonly userId: string;
  readonly messageId: string;
  readonly message: string;
  readonly files?: FileInfo[];
}

export interface MessageDelete {
  readonly roomId: string;
  readonly userId: string;
  readonly messageId: string;
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
  readonly messageIds: string[];
}

// export interface ChatRoomUnreadCount {
//   readonly userId?: string;
// }

// export interface Mention<T> {
//   mention: string;
//   data: T;
// }

// export type UserMention = Mention<{ userId: string }>;

// export interface ChatMessageMentions {
//   mentions: UserMention[];
// }

// export interface ListUsersForChatEvents {
//   readonly roomId: string;
// }

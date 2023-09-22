export interface RoomEvent {
  roomId: string;
}

export interface UserEvent {
  roomId: string;
  userId: string;
}

export interface MessageEvent {
  roomId: string;
  userId: string;
  messageId: string;
}
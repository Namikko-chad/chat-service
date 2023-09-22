export enum MessageStatus {
  New = 'new',
  Delivered = 'delivered',
  Read = 'read',
  Deleted = 'deleted',
}

export enum Event {
  RoomCreated = 'room-created',
  RoomUpdated = 'room-updated',
  RoomDeleted = 'room-deleted',
  MessageCreated = 'message-created',
  MessageDelivered = 'message-delivered',
  MessageRead = 'message-read',
  MessageEdited = 'message-edited',
  MessageDeleted = 'message-deleted',
  UserAdded = 'user-added',
  UserDeleted = 'user-deleted',
}

export enum Errors {
  RoomCreateForbidden = 403511,
  RoomNotFound = 404510,
  MessageNotFound = 404520,
}

export const ErrorsMessages: Record<Errors, string> = {
  [Errors.RoomCreateForbidden]: 'Chat: Only manager can create room',
  [Errors.RoomNotFound]: 'Chat: room not found',
  [Errors.MessageNotFound]: 'Chat: message not found',
};
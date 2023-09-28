export enum MessageStatus {
  New = 'new',
  Delivered = 'delivered',
  Read = 'read',
  Deleted = 'deleted',
}

export enum Flow {
  RoomCreate = 'room-create',
  RoomUpdate = 'room-update',
  RoomDelete = 'room-delete',
  MessageCreate = 'message-create',
  MessageEdit = 'message-edit',
  MessageDelete = 'message-delete',
  UserAdd = 'user-add',
  UserRemove = 'user-remove'
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
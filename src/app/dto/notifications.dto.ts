import { FileInfo, } from './files.dto';

export enum NotificationType {
  Chat = 'chat',
}

export enum Channels {
  WS = 'ws',
}

export interface INotificationPayload {
  readonly type: NotificationType;
  readonly subject?: string;
  readonly message?: string;
  readonly placeHolders?: Array<string | number>;
  readonly files?: FileInfo[];
  readonly data?: Record<string, unknown>;
  readonly destination?: readonly string[] | string;
  readonly preferredChannel?: Channels;
}
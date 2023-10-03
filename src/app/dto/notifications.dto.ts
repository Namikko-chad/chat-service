import { FileInfo, } from './files.dto';

export enum NotificationType {
  Chat = 'chat',
}

export enum Channels {
  WS = 'ws',
}

export interface INotificationPayload {
  type: NotificationType;
  subject?: string;
  message?: string;
  placeHolders?: Array<string | number>;
  files?: FileInfo[];
  data?: Record<string, unknown>;
  channels: Partial<Record<Channels, string>>;
  preferredChannel?: Channels;
}
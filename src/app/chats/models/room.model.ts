import { AbstractModel, } from '../../database';
import { FileModel, } from './file.model';
import { MessageModel, } from './message.model';
import { UserModel, } from './user.model';

export interface RoomModel extends AbstractModel {
  name?: string;
  iconId?: string;
  massages?: MessageModel[];
  users?: UserModel[];
  files?: FileModel[];
  messagesCount?: number;
  unreadMessagesCount?: number;
  usersCount?: number;
}
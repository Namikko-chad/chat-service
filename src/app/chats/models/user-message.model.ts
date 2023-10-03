import { AbstractModel, } from '../../database';
import { MessageStatus, } from '../chats.enum';

export interface UserMessageModel extends AbstractModel {
  id: string;
  roomId: string;
  messageId: string;
  userId: string;
  status: MessageStatus;
}
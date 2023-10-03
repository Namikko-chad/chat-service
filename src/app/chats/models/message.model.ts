import { AbstractModel, } from '../../database';
import { FileModel, } from './file.model';

export interface MessageModel extends AbstractModel {
  roomId: string;
  userId: string;
  message?: string;
  edited: boolean;
  files?: FileModel[];
}
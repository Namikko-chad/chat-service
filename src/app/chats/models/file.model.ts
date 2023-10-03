import { AbstractModel, } from '../../database';
import { FileInfo, } from '../../dto';

export interface FileModel extends AbstractModel {
  roomId: string;
  messageId: string;
  fileId: string;
  meta: FileInfo;
}
import { AbstractModel, } from '../../database';

export interface UserModel extends AbstractModel {
  id: string;
  roomId: string;
  userId: string;
}
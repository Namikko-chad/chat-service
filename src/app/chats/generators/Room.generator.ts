
import { DeepPartial, } from 'typeorm';

import { AbstractGenerator, } from '../../database';
import { Utils, } from '../../utils';
import { Room, } from '../entities/Room.entity';

export class RoomGenerator extends AbstractGenerator<Room> {

  default(): DeepPartial<Room> {
    return {
      id: Utils.getUUID(),
      name: Utils.getUUID(),
    };
  }
}

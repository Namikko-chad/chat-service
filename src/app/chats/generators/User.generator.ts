
import { DeepPartial, } from 'typeorm';

import { AbstractGenerator, } from '../../database';
import { Utils, } from '../../utils';
import { User, } from '../entities/User.entity';

export interface MessageGeneratorOptions extends Partial<User> {
  roomId: string;
}

export class UserGenerator extends AbstractGenerator<User> {

  default(): DeepPartial<User> {
    return {
      id: Utils.getUUID(),
    };
  }

  override create(params: MessageGeneratorOptions): Promise<User> {
    return super.create(params);
  }
}


import { DeepPartial, } from 'typeorm';

import { AbstractGenerator, } from '../../database';
import { Utils, } from '../../utils';
import { File, } from '../entities/File.entity';

export interface MessageGeneratorOptions extends Partial<File> {
  roomId: string;
  messageId: string;
  userId: string
}

export class UserGenerator extends AbstractGenerator<File> {

  default(): DeepPartial<File> {
    return {
      id: Utils.getUUID(),
    };
  }

  override create(params: MessageGeneratorOptions): Promise<File> {
    return super.create(params);
  }
}

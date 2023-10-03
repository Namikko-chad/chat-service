
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
      meta: {
        id: '0c35aba6-c092-4096-ae1d-74d41024269c',
        name: 'PassportGG (Estimation).pdf',
        ext: 'pdf',
        mime: 'application/pdf',
        size: 4547842,
        public: false,
        userId: 'f5c5fc7e-9e69-4537-9c9a-5f0046cd6ab3',
        hash: '1d4b44a57a754bb7999ae3d6ec6fcfb5',
      },
    };
  }

  override create(params: MessageGeneratorOptions): Promise<File> {
    return super.create(params);
  }
}

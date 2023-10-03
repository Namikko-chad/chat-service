import { ObjectLiteral, PrimaryGeneratedColumn, } from 'typeorm';
import { uuidv7, } from 'uuidv7';

import { AbstractModel, } from './AbstractModel';
import { CreateTimestampColumn, UpdateTimestampColumn, } from './decorators/timestamp-column.decorator';

export abstract class AbstractEntity implements ObjectLiteral, AbstractModel {
  @PrimaryGeneratedColumn('uuid', {})
    id: string = uuidv7();

  @CreateTimestampColumn({})
    createdAt: Date = new Date();

  @UpdateTimestampColumn({})
    updatedAt: Date = new Date();
}

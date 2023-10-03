import { ObjectLiteral, PrimaryGeneratedColumn, } from 'typeorm';
import { v4 as uuidv4, } from 'uuid';

import { AbstractModel, } from './AbstractModel';
import { CreateTimestampColumn, UpdateTimestampColumn, } from './decorators/timestamp-column.decorator';

export abstract class AbstractEntity implements ObjectLiteral, AbstractModel {
  @PrimaryGeneratedColumn('uuid', {})
    id: string = uuidv4();

  @CreateTimestampColumn({})
    createdAt: Date = new Date();

  @UpdateTimestampColumn({})
    updatedAt: Date = new Date();
}

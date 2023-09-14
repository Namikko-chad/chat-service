import { ObjectLiteral, PrimaryGeneratedColumn, } from 'typeorm';
import { v4 as uuidv4, } from 'uuid';

import { CreateTimestampColumn, UpdateTimestampColumn, } from './decorators/timestamp-column.decorator';

export abstract class AbstractEntity implements ObjectLiteral {
  @PrimaryGeneratedColumn('uuid', {})
    id: string = uuidv4();

  @CreateTimestampColumn({})
    createdAt = Date.now();

  @UpdateTimestampColumn({})
    updatedAt = Date.now();
}

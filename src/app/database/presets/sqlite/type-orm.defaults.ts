import { ObjectLiteral, SelectQueryBuilder, ValueTransformer, } from 'typeorm';

import { TypeORMDefaults as Defaults, } from '../base';
import { TypeORMPreset, } from '../type-orm.preset';

const JsonTransformer: ValueTransformer = {
  to(value: unknown | null | undefined): string | null | undefined {
    return value != null ? JSON.stringify(value) : null;
  },
  from(value: string | null | undefined): unknown | null {
    return value != null ? JSON.parse(value) : null;
  },
};

const TimestampTransformer: ValueTransformer = {
  to(value?: Date | null): string | null | undefined {
    return value instanceof Date || typeof value === 'number' ? new Date(value).toISOString() : value;
  },
  from(value?: string | null): Date | null | undefined {
    return value != null ? new Date(value) : null;
  },
};

/**
 * This is a preset to use inside tests.
 *
 * Jest's [moduleNameMapper] option can be utilized to replace the `default` preset with this one.
 *
 * [moduleNameMapper]: https://jestjs.io/docs/configuration#modulenamemapper-objectstring-string--arraystring
 */
export const TypeORMDefaults: TypeORMPreset = {
  ...Defaults,
  types: {
    ...Defaults.types,
    timestamp: 'datetime', // sqlite does not support `timestamptz`
    enum: 'varchar',
    json: 'text',
  },
  transformer: {
    json: JsonTransformer,
    timestamp: TimestampTransformer,
  },
  // sqlite does not support locking
  locks: {
    forNoKeyUpdate: {
      mode: 'dirty_read',
      setLock<TEntity extends ObjectLiteral>(
        qb: SelectQueryBuilder<TEntity>,
        _tables?: string[]
      ): void {
        qb.setLock(this.mode, undefined);
      },
    },
    forUpdate: {
      mode: 'dirty_read',
      setLock<TEntity extends ObjectLiteral>(
        qb: SelectQueryBuilder<TEntity>,
        _tables?: string[]
      ): void {
        qb.setLock(this.mode);
      },
    },
  },
  default: () => 'CURRENT_TIMESTAMP',
};

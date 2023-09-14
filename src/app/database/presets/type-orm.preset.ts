import { ColumnType, ObjectLiteral, SelectQueryBuilder, } from 'typeorm';

/**
 * TypeORM presets for account store module.
 *
 * Used to overcome incompatibilities between PostgreSQL and SqLite mappings.
 */
export interface TypeORMPreset {
  /**
   * Column data types.
   */
  readonly types: {
    readonly timestamp: ColumnType;
    readonly enum: ColumnType;
    readonly json: ColumnType;
  };

  /**
   * Supported lock type.
   */
  readonly locks: {
    readonly forNoKeyUpdate: {
      readonly mode: 'for_no_key_update' | 'pessimistic_write' | 'dirty_read';
      setLock<TEntity extends ObjectLiteral>(
        qb: SelectQueryBuilder<TEntity>,
        tables?: string[],
      ): void;
    };
    readonly forUpdate: {
      readonly mode: 'pessimistic_write' | 'dirty_read';
      setLock<TEntity extends ObjectLiteral>(
        qb: SelectQueryBuilder<TEntity>,
        tables?: string[],
      ): void;
    };
  };

  readonly default?: any
}

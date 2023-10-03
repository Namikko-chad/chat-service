import { Column, ColumnOptions, } from 'typeorm';

import { TypeORMDefaults, } from '../presets';

/**
 * JSON column decorator used to decorate `Entity` columns containing JSON data.
 *
 * Maps to `jsonb` type by default.
 *
 * @param options - Column options.
 *
 * @returns New property decorator.
 */
export function JsonColumn(options: ColumnOptions = {}): PropertyDecorator {
  return Column(JsonColumnOptions(options));
}

function JsonColumnOptions(options: ColumnOptions): ColumnOptions {
  const { type = TypeORMDefaults.types.json, transformer = TypeORMDefaults?.transformer?.json, } = options;

  return {
    ...options,
    type,
    transformer,
  };
}
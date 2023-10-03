import { Column, ColumnOptions, } from 'typeorm';

import { TypeORMDefaults, } from '../presets';

/**
 * Enum column decorator used to decorate `Entity` columns containing enum data.
 *
 * Maps to `enum` type by default.
 *
 * @param options - Column options.
 *
 * @returns New property decorator.
 */
export function EnumColumn(options: ColumnOptions = {}) {
  return Column(enumColumnOptions(options));
}

function enumColumnOptions(options: ColumnOptions): ColumnOptions {
  const { type = TypeORMDefaults.types.enum, } = options;

  return {
    ...options,
    type,
  };
}

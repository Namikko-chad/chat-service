import { Column, ColumnOptions, } from 'typeorm';

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
  const { type = 'jsonb', } = options;

  return Column({ ...options, type, });
}

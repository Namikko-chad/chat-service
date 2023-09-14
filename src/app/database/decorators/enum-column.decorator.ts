import { Column, ColumnOptions, } from 'typeorm';

import { TypeORMDefaults, } from '../presets';


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

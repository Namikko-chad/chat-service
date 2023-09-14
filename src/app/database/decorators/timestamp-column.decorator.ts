import {
  Column,
  ColumnOptions,
  CreateDateColumn,
  PrimaryColumn,
  PrimaryColumnOptions,
  UpdateDateColumn,
  ValueTransformer, } from 'typeorm';

import { TypeORMDefaults, } from '../presets';

export function TimestampColumn(options?: ColumnOptions): PropertyDecorator {
  return Column(timestampColumnOptions(options));
}

export function PrimaryTimestampColumn(options?: PrimaryColumnOptions): PropertyDecorator {
  return PrimaryColumn(timestampColumnOptions(options));
}

export function CreateTimestampColumn(options?: ColumnOptions): PropertyDecorator {
  return CreateDateColumn(timestampColumnOptions(options));
}

export function UpdateTimestampColumn(options?: ColumnOptions): PropertyDecorator {
  return UpdateDateColumn(timestampColumnOptions(options));
}

const TimestampTransformer: ValueTransformer = {
  to(value?: Date | null): string | null | undefined {
    return value ? new Date(value).toISOString() : null;
  },
  from(value?: string | null): Date | null | undefined {
    return value != null ? new Date(value) : null;
  },
};

function timestampColumnOptions(options?: PrimaryColumnOptions): PrimaryColumnOptions;
function timestampColumnOptions(options?: ColumnOptions): ColumnOptions;
function timestampColumnOptions(options: ColumnOptions | PrimaryColumnOptions = {}): ColumnOptions | PrimaryColumnOptions {
  const { type = TypeORMDefaults.types.timestamp, transformer = TimestampTransformer, } = options;

  return {
    ...options,
    transformer,
    type,
  };
}
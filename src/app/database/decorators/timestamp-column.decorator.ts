import {
  Column,
  ColumnOptions,
  CreateDateColumn,
  PrimaryColumn,
  PrimaryColumnOptions,
  UpdateDateColumn, } from 'typeorm';

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

function timestampColumnOptions(options?: PrimaryColumnOptions): PrimaryColumnOptions;
function timestampColumnOptions(options?: ColumnOptions): ColumnOptions;
function timestampColumnOptions(options: ColumnOptions | PrimaryColumnOptions = {}): ColumnOptions | PrimaryColumnOptions {
  const { type = TypeORMDefaults.types.timestamp, transformer = TypeORMDefaults?.transformer?.timestamp, } = options;

  return {
    ...options,
    transformer,
    type,
  };
}
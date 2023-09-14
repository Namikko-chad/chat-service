import { Column, ColumnOptions, ValueTransformer, } from 'typeorm';

const JsonColumn$sqlite$transformer: ValueTransformer = {
  to(value: unknown | null | undefined): string | null | undefined {
    return value != null ? JSON.stringify(value) : null;
  },
  from(value: string | null | undefined): unknown | null {
    return value != null ? JSON.parse(value) : null;
  },
};

export function JsonColumn(options: ColumnOptions = {}): PropertyDecorator {
  return Column({ ...options, type: 'text', transformer: JsonColumn$sqlite$transformer, });
}

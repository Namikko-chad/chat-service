import { ConfigService, } from '@nestjs/config';
import { DataSourceOptions, } from 'typeorm/data-source/DataSourceOptions';

import { CustomNamingStrategy, } from './CustomNamingStrategy';

export function databaseConfig(configService: ConfigService): DataSourceOptions {
  return {
    namingStrategy: new CustomNamingStrategy(),
    type: 'postgres',
    schema: 'chat',
    url: configService.getOrThrow('DATABASE_LINK'),
    migrationsRun: false,
    logging: configService.get<string>('DEBUG') === 'true',
  };
}

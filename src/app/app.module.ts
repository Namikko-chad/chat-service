import { Module, } from '@nestjs/common';
import { ConfigModule, } from '@nestjs/config';
import { EventEmitterModule, } from '@nestjs/event-emitter';

import { AuthModule, } from './auth';
import { ChatModule, } from './chats';
import { DatabaseModule, } from './database';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    EventEmitterModule.forRoot({
      delimiter: '-',
    }),
    DatabaseModule,
    AuthModule,
    ChatModule
  ],
})
export class AppModule {}

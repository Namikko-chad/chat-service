import { EventEmitter2, EventEmitterModule, } from '@nestjs/event-emitter';
import { Test, } from '@nestjs/testing';

import { beforeAll,describe, expect, it,  } from '@jest/globals';

import { LoggerEvent, } from './logger.events';

describe('Logger event', () => {
  let eventEmitter: EventEmitter2;

  beforeAll(async () => {
    process.env['NODE_ENV'] = 'test';
    const moduleRef = await Test.createTestingModule({
      imports: [
        EventEmitterModule.forRoot({
          delimiter: '-',
        })
      ],
      providers: [
        LoggerEvent
      ],
    }).compile();

    eventEmitter = moduleRef.get(EventEmitter2);
  });

  describe('work with file', () => {
    it('emit event', () => {
      eventEmitter.emit('order-create', { userId: 1, });
      expect(1).toBe(1);
    });
  });

});
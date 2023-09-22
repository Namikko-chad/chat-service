import { Injectable, Logger, } from '@nestjs/common';
import { OnEvent, } from '@nestjs/event-emitter';

@Injectable()
export class LoggerEvent {
  private readonly logger = new Logger('Events');

  @OnEvent('**')
  handleEverything(payload: unknown) {
    this.logger.log(payload);
  }
}
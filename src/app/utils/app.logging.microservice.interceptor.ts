import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import type { RmqContext, } from '@nestjs/microservices';
import { Observable, tap, } from 'rxjs';
  
@Injectable()
export class MicroserviceLoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger(MicroserviceLoggingInterceptor.name);
  
  intercept(
    context: ExecutionContext,
    next: CallHandler<unknown>
  ): Observable<unknown> | Promise<Observable<unknown>> {
    const rpcHost = context.switchToRpc();
  
    const data = rpcHost.getData<object>();
    const ctx = rpcHost.getContext<RmqContext>();
  
    this.logger.log(`Incoming message: pattern: ${ctx.getPattern()}, data: ${JSON.stringify(data)}`);
  
    return next
      .handle()
      .pipe(
        tap(
          (response) =>
            response &&
              this.logger.log(`Outgoing message: pattern: ${ctx.getPattern()}, data: ${JSON.stringify(response)}`)
        )
      );
  }
}
  
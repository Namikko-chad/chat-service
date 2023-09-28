import { CallHandler, ExecutionContext, Injectable, Logger, NestInterceptor, } from '@nestjs/common';
import { Observable, tap, } from 'rxjs';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly _logger = new Logger('API Request');

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> | Promise<Observable<unknown>> {
    const request = context.switchToHttp().getRequest<{
      method: string;
      originalUrl: string;
      body: object;
    }>();
    this._logger.log(`${request.method} ${request.originalUrl} ${Object.values(request.body).length ? JSON.stringify(request.body) : ''}`);

    return next
      .handle()
      .pipe(
        tap(
          (response) =>
            response && process.env['DEBUG'] === 'true' ?
              this._logger.log(`Response: data: ${JSON.stringify(response)}`) : undefined
        )
      );
  }
}

import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { WsException } from '@nestjs/websockets';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

@Injectable()
export class WsInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const client = context.switchToWs().getClient();

    const token = client.handshake?.headers?.authorization;

    if (!token || token !== 'valid-token') {
      throw new WsException('Unauthorized');
    }

    return next.handle().pipe(
      tap(() => {
        // Optionally add logging or other s ide effects
      }),
      catchError((err) => {
        return throwError(() => new WsException(err.message));
      })
    );
  }
}

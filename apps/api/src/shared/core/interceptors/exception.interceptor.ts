import {
  CallHandler,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { Request } from 'express';
import { catchError, Observable, throwError } from 'rxjs';

import { translate } from '../../i18n/translate';

@Injectable()
export class ExceptionInterceptor implements NestInterceptor {
  private logger = new Logger(ExceptionInterceptor.name);
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const ctx = context.switchToHttp();
    const request = ctx.getRequest<Request>();

    return next.handle().pipe(
      catchError((error) => {
        console.error(error);
        this.logger.error(error);
        let status = HttpStatus.INTERNAL_SERVER_ERROR;
        let message: string | object = translate(
          'errors.internal_server_error',
          'Internal server error',
        );

        if (error instanceof HttpException) {
          status = error.getStatus();
          message = error.getResponse();
        }

        const formattedError = {
          statusCode: status,
          message:
            typeof message === 'string'
              ? message
              : (message as any)?.message ||
                translate('errors.internal_server_error', 'Error'),
          data:
            typeof message === 'string' ? null : (message as any)?.data || null,
          path: request.url,
          timestamp: new Date().toISOString(),
          success: false,
        };

        return throwError(() => new HttpException(formattedError, status));
      }),
    );
  }
}

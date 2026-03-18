import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { translate } from '../../i18n/translate';
import { ResponsePayload } from '../interfaces/response.interface';

@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<T, ResponsePayload<T>> {
  intercept(context: ExecutionContext, next: CallHandler): Observable<ResponsePayload<T>> {
    const request = context.switchToHttp().getRequest();
    const statusCode = context.switchToHttp().getResponse().statusCode;

    const isGraphQL = context.getType<string>() === 'graphql';

    // skip transformation for GraphQL
    if (isGraphQL) {
      return next.handle().pipe(
        map((data) => {
          // For GraphQL, we should only transform the data if needed
          // Most of the time, you might want to leave the GraphQL response structure intact
          if (data && typeof data === 'object' && !Array.isArray(data)) {
            return {
              ...data,
              __metadata: {
                timestamp: new Date().toISOString(),
                message: translate('success', 'Success'),
              },
            };
          }
          return data;
        })
      );
    }

    return next.handle().pipe(
      map((data) => {
        if (data && data?.['validation']) {
          //  return details of validation errors
          return {
            statusCode: statusCode,
            message: translate('errors.validation_failed', 'Validation failed'),
            data: data.validation,
            path: request.url,
            timestamp: new Date().toISOString(),
            success: false,
          };
        }
        return {
          statusCode,
          message: translate('success', 'Success'),
          data: data ?? null,
          path: request.url,
          timestamp: new Date().toISOString(),
          success: true,
        };
      })
    );
  }
}

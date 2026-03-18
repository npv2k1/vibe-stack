// resolve.interceptor.ts
import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { SetMetadata } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';

export const RESOLVE_METADATA_KEY = 'custom:resolve';

export const Resolve = (resolver: (data: any) => any) =>
  SetMetadata(RESOLVE_METADATA_KEY, resolver);

// Resolve more fields and merge into the response object
@Injectable()
export class ResolveInterceptor implements NestInterceptor {
  constructor(private readonly reflector: Reflector) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const resolver = this.reflector.get<(data: any) => any>(RESOLVE_METADATA_KEY, context.getHandler());

    if (!resolver) {
      return next.handle();
    }

    return next.handle().pipe(
      map(async (data) => {
        // Apply to each object if data is an array
        if (Array.isArray(data)) {
          const resolvedArray = await Promise.all(
            data.map(async (item) => ({
              ...item,
              ...(await resolver(item)),
            }))
          );
          return resolvedArray;
        }

        // Otherwise, apply to a single object
        const resolvedFields = await resolver(data);
        return {
          ...data,
          ...resolvedFields,
        };
      }),
      mergeMap((result) => result)
    );
  }
}

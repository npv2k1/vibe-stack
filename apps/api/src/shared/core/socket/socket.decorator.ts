// ws-on-message.decorator.ts
import { applyDecorators, Injectable, UseInterceptors } from '@nestjs/common';
import { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';
import { SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';
import { map, Observable } from 'rxjs';

import { translate } from '../../i18n/translate';

export interface WsResponsePayload<T> {
  statusCode: number; // bạn tự quy ước, WS không có status code thật
  message: string;
  data: T | null;
  path: string; // ví dụ: "/wrtc:join-room"
  timestamp: string;
  success: boolean;
}

@Injectable()
export class WsTransformInterceptor<T> implements NestInterceptor<T, WsResponsePayload<any>> {
  intercept(context: ExecutionContext, next: CallHandler): Observable<WsResponsePayload<any>> {
    const ws = context.switchToWs();
    const client: any = ws.getClient(); // socket.io Socket
    const payload = ws.getData(); // data client gửi lên

    // Tên handler trong code (không phải event name)
    const handlerName = context.getHandler()?.name ?? 'unknown';

    // socket.io: event name thường nằm ở packet[0], data nằm ở packet[1]
    // (tuỳ adapter/version). Mình fallback an toàn.
    const eventName = client?.handshake?.query?.event || client?.data?.event || handlerName;

    const namespace = client?.nsp?.name ?? '';
    const path = `${namespace}:${eventName}`;

    // WS không có statusCode, bạn quy ước:
    const okCode = 200;
    const validationCode = 422;

    console.log('WS Transform Interceptor - path:', path, 'payload:', payload);

    return next.handle().pipe(
      map((data: any) => {
        if (data && data?.validation) {
          return {
            statusCode: validationCode,
            message: translate('errors.validation_failed', 'Validation failed'),
            data: data.validation,
            path,
            timestamp: new Date().toISOString(),
            success: false,
          };
        }

        return {
          statusCode: okCode,
          message: translate('success', 'Success'),
          data: data ?? null,
          path,
          timestamp: new Date().toISOString(),
          success: true,
        };
      })
    );
  }
}
export function OnEventMessage(event: string): MethodDecorator {
  return applyDecorators(SubscribeMessage(event), UseInterceptors(WsTransformInterceptor));
}

export function SocketController(
  port: number,
  options?: {
    namespace?: string;
    transports?: string[];
    cors?: any;
  }
) {
  return applyDecorators(
    WebSocketGateway(port, {
      namespace: options?.namespace ?? '',
      transports: options?.transports ?? ['websocket'],
      cors: options?.cors ?? {
        origin: '*',
      },
    })
  );
}

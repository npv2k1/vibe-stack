import { HttpStatus, Injectable } from '@nestjs/common';

import { translate } from '../i18n/translate';

import { ResponsePayload } from './interfaces/response.interface';

@Injectable()
export class ResponseBuilder {
  static success<T>(
    data: T,
    message = translate('success', 'Success'),
  ): ResponsePayload<T> {
    return {
      statusCode: HttpStatus.OK,
      message,
      data,
    };
  }

  static created<T>(
    data: T,
    message = translate('created', 'Created successfully'),
  ): ResponsePayload<T> {
    return {
      statusCode: HttpStatus.CREATED,
      message,
      data,
    };
  }

  static error<T>(
    statusCode: number,
    message: string,
    data?: T,
  ): ResponsePayload<T> {
    return {
      statusCode,
      message,
      data: data as T,
    };
  }

  static badRequest<T>(
    message = translate('errors.bad_request', 'Bad request'),
    data?: T,
  ): ResponsePayload<T> {
    return this.error(HttpStatus.BAD_REQUEST, message, data);
  }

  static notFound<T>(
    message = translate('errors.not_found', 'Not found'),
    data?: T,
  ): ResponsePayload<T> {
    return this.error(HttpStatus.NOT_FOUND, message, data);
  }

  static unauthorized<T>(
    message = translate('errors.unauthorized', 'Unauthorized'),
    data?: T,
  ): ResponsePayload<T> {
    return this.error(HttpStatus.UNAUTHORIZED, message, data);
  }

  static forbidden<T>(
    message = translate('errors.forbidden', 'Forbidden'),
    data?: T,
  ): ResponsePayload<T> {
    return this.error(HttpStatus.FORBIDDEN, message, data);
  }
}

import { HttpException, HttpStatus } from '@nestjs/common';

import { translate } from '../../i18n/translate';
import { ResponsePayload } from '../interfaces/response.interface';

export class ValidationException extends HttpException {
  constructor(errors: any) {
    const response: ResponsePayload<any> = {
      statusCode: HttpStatus.BAD_REQUEST,
      message: translate('errors.validation_failed', 'Validation failed'),
      data: errors,
      path: undefined,
      timestamp: new Date().toISOString(),
    };
    super(response, HttpStatus.BAD_REQUEST);
  }
}

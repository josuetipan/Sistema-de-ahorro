import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { STATUS_CODES } from 'node:http';
import type { Response } from 'express';

/**
 * Da formato uniforme a los errores con el mismo envelope `{ code, status, body }`.
 * El `body` contiene el detalle del error (mensaje/validaciones).
 */
@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const response = host.switchToHttp().getResponse<Response>();

    let code = HttpStatus.INTERNAL_SERVER_ERROR;
    let body: unknown = { message: 'Error interno del servidor' };

    if (exception instanceof HttpException) {
      code = exception.getStatus();
      const res = exception.getResponse();
      body = typeof res === 'string' ? { message: res } : res;
    } else {
      this.logger.error(
        'Excepción no controlada',
        exception instanceof Error ? exception.stack : String(exception),
      );
    }

    response.status(code).json({
      code,
      status: STATUS_CODES[code] ?? 'Error',
      body,
    });
  }
}

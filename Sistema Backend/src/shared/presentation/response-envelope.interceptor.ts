import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { STATUS_CODES } from 'node:http';
import type { Response } from 'express';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface ResponseEnvelope<T> {
  code: number;
  status: string;
  body: T;
}

/**
 * Envuelve toda respuesta exitosa en el formato estándar
 * `{ code, status, body }`.
 */
@Injectable()
export class ResponseEnvelopeInterceptor<T>
  implements NestInterceptor<T, ResponseEnvelope<T>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler<T>,
  ): Observable<ResponseEnvelope<T>> {
    const response = context.switchToHttp().getResponse<Response>();
    return next.handle().pipe(
      map((body) => {
        const code = response.statusCode ?? 200;
        return {
          code,
          status: STATUS_CODES[code] ?? 'OK',
          body,
        };
      }),
    );
  }
}

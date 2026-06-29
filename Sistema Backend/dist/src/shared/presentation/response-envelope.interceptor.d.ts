import { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
export interface ResponseEnvelope<T> {
    code: number;
    status: string;
    body: T;
}
export declare class ResponseEnvelopeInterceptor<T> implements NestInterceptor<T, ResponseEnvelope<T>> {
    intercept(context: ExecutionContext, next: CallHandler<T>): Observable<ResponseEnvelope<T>>;
}

import { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';
import type { Cache } from 'cache-manager';
import { Observable } from 'rxjs';
export declare class HttpCacheInterceptor implements NestInterceptor {
    private readonly cache;
    private readonly logger;
    private static readonly OP_TIMEOUT_MS;
    private static readonly COOLDOWN_MS;
    private cacheDisabledUntil;
    constructor(cache: Cache);
    intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<unknown>>;
    private buildKey;
    private isCircuitOpen;
    private openCircuit;
    private safeGet;
    private safeSet;
    private withTimeout;
}

import { CACHE_MANAGER } from '@nestjs/cache-manager';
import {
  CallHandler,
  ExecutionContext,
  Inject,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import type { Cache } from 'cache-manager';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';

interface RequestLike {
  method: string;
  originalUrl?: string;
  url: string;
  user?: { id?: string };
}

/**
 * Caché HTTP respaldada por Redis, solo para peticiones GET.
 *
 * Características clave:
 * - **Por usuario**: la clave incluye el id del usuario autenticado para que
 *   los datos de un cliente jamás se sirvan a otro.
 * - **Nunca bloquea**: las operaciones de caché tienen un timeout corto; si
 *   Redis tarda o está caído, la petición continúa sin caché.
 * - **Circuit breaker**: ante un fallo, desactiva la caché unos segundos para
 *   no penalizar cada petición mientras Redis no esté disponible.
 */
@Injectable()
export class HttpCacheInterceptor implements NestInterceptor {
  private readonly logger = new Logger(HttpCacheInterceptor.name);
  private static readonly OP_TIMEOUT_MS = 200;
  private static readonly COOLDOWN_MS = 10_000;
  private cacheDisabledUntil = 0;

  constructor(@Inject(CACHE_MANAGER) private readonly cache: Cache) {}

  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<unknown>> {
    const request = context.switchToHttp().getRequest<RequestLike>();

    if (request.method !== 'GET' || this.isCircuitOpen()) {
      return next.handle();
    }

    const key = this.buildKey(request);
    const cached = await this.safeGet(key);
    if (cached !== undefined) {
      return of(cached);
    }

    return next.handle().pipe(
      tap((response) => {
        if (response !== undefined) {
          // Fire-and-forget: no esperamos a que termine el guardado.
          void this.safeSet(key, response);
        }
      }),
    );
  }

  private buildKey(request: RequestLike): string {
    const url = request.originalUrl ?? request.url;
    const userId = request.user?.id;
    return userId ? `u:${userId}::${url}` : `anon::${url}`;
  }

  private isCircuitOpen(): boolean {
    return Date.now() < this.cacheDisabledUntil;
  }

  private openCircuit(error: unknown): void {
    const firstTrip = !this.isCircuitOpen();
    this.cacheDisabledUntil = Date.now() + HttpCacheInterceptor.COOLDOWN_MS;
    if (firstTrip) {
      const message = error instanceof Error ? error.message : String(error);
      this.logger.warn(
        `Caché Redis no disponible; se omite por ${HttpCacheInterceptor.COOLDOWN_MS / 1000}s: ${message}`,
      );
    }
  }

  private async safeGet(key: string): Promise<unknown> {
    try {
      return await this.withTimeout(this.cache.get(key));
    } catch (error) {
      this.openCircuit(error);
      return undefined;
    }
  }

  private async safeSet(key: string, value: unknown): Promise<void> {
    try {
      await this.withTimeout(this.cache.set(key, value));
    } catch (error) {
      this.openCircuit(error);
    }
  }

  private withTimeout<T>(promise: Promise<T>): Promise<T> {
    return Promise.race([
      promise,
      new Promise<T>((_resolve, reject) =>
        setTimeout(
          () => reject(new Error('timeout de operación de caché')),
          HttpCacheInterceptor.OP_TIMEOUT_MS,
        ),
      ),
    ]);
  }
}

import { CacheModule } from '@nestjs/cache-manager';
import { Logger, Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { createKeyv } from '@keyv/redis';
import { HttpCacheInterceptor } from './http-cache.interceptor';

/**
 * Configura una caché global respaldada por Redis y la aplica a todos los
 * endpoints GET mediante {@link HttpCacheInterceptor}.
 *
 * Resiliencia: si Redis no está disponible se registra un aviso y la API
 * sigue respondiendo sin caché (no lanza errores al cliente).
 */
@Module({
  imports: [
    CacheModule.registerAsync({
      isGlobal: true,
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const logger = new Logger('RedisCache');
        const url =
          config.get<string>('REDIS_URL') ?? 'redis://localhost:6379';
        const ttl = Number(config.get('CACHE_TTL_MS') ?? 30_000);

        const keyv = createKeyv({
          url,
          // `disableOfflineQueue` hace que los comandos fallen al instante si
          // Redis no está conectado, en vez de quedarse en cola esperando: así
          // la API nunca se cuelga cuando Redis está caído.
          disableOfflineQueue: true,
          socket: {
            connectTimeout: 1_000,
            // Reintenta en segundo plano (1s..15s) para reconectar cuando
            // Redis vuelva, sin bloquear las peticiones.
            reconnectStrategy: (retries: number) =>
              Math.min(1_000 + retries * 1_000, 15_000),
          },
        });
        let redisErrorLogged = false;
        keyv.on('error', (err: unknown) => {
          // Evita inundar los logs: solo avisa una vez por caída.
          if (redisErrorLogged) {
            return;
          }
          redisErrorLogged = true;
          const message = err instanceof Error ? err.message : String(err);
          logger.warn(
            `Redis no disponible, se omite la caché hasta reconectar: ${message}`,
          );
        });
        keyv.on('connect', () => {
          redisErrorLogged = false;
          logger.log('Conectado a Redis: caché de GET activa');
        });

        return {
          ttl,
          stores: [keyv],
        };
      },
    }),
  ],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: HttpCacheInterceptor,
    },
  ],
})
export class RedisCacheModule {}

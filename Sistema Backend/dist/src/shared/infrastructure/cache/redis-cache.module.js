"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RedisCacheModule = void 0;
const cache_manager_1 = require("@nestjs/cache-manager");
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const config_1 = require("@nestjs/config");
const redis_1 = require("@keyv/redis");
const http_cache_interceptor_1 = require("./http-cache.interceptor");
let RedisCacheModule = class RedisCacheModule {
};
exports.RedisCacheModule = RedisCacheModule;
exports.RedisCacheModule = RedisCacheModule = __decorate([
    (0, common_1.Module)({
        imports: [
            cache_manager_1.CacheModule.registerAsync({
                isGlobal: true,
                imports: [config_1.ConfigModule],
                inject: [config_1.ConfigService],
                useFactory: (config) => {
                    const logger = new common_1.Logger('RedisCache');
                    const url = config.get('REDIS_URL') ?? 'redis://localhost:6379';
                    const ttl = Number(config.get('CACHE_TTL_MS') ?? 30_000);
                    const keyv = (0, redis_1.createKeyv)({
                        url,
                        disableOfflineQueue: true,
                        socket: {
                            connectTimeout: 1_000,
                            reconnectStrategy: (retries) => Math.min(1_000 + retries * 1_000, 15_000),
                        },
                    });
                    let redisErrorLogged = false;
                    keyv.on('error', (err) => {
                        if (redisErrorLogged) {
                            return;
                        }
                        redisErrorLogged = true;
                        const message = err instanceof Error ? err.message : String(err);
                        logger.warn(`Redis no disponible, se omite la caché hasta reconectar: ${message}`);
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
                provide: core_1.APP_INTERCEPTOR,
                useClass: http_cache_interceptor_1.HttpCacheInterceptor,
            },
        ],
    })
], RedisCacheModule);
//# sourceMappingURL=redis-cache.module.js.map
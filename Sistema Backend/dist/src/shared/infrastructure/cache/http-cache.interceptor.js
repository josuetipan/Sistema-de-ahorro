"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var HttpCacheInterceptor_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.HttpCacheInterceptor = void 0;
const cache_manager_1 = require("@nestjs/cache-manager");
const common_1 = require("@nestjs/common");
const rxjs_1 = require("rxjs");
const operators_1 = require("rxjs/operators");
let HttpCacheInterceptor = class HttpCacheInterceptor {
    static { HttpCacheInterceptor_1 = this; }
    cache;
    logger = new common_1.Logger(HttpCacheInterceptor_1.name);
    static OP_TIMEOUT_MS = 200;
    static COOLDOWN_MS = 10_000;
    cacheDisabledUntil = 0;
    constructor(cache) {
        this.cache = cache;
    }
    async intercept(context, next) {
        const request = context.switchToHttp().getRequest();
        if (request.method !== 'GET' || this.isCircuitOpen()) {
            return next.handle();
        }
        const key = this.buildKey(request);
        const cached = await this.safeGet(key);
        if (cached !== undefined) {
            return (0, rxjs_1.of)(cached);
        }
        return next.handle().pipe((0, operators_1.tap)((response) => {
            if (response !== undefined) {
                void this.safeSet(key, response);
            }
        }));
    }
    buildKey(request) {
        const url = request.originalUrl ?? request.url;
        const userId = request.user?.id;
        return userId ? `u:${userId}::${url}` : `anon::${url}`;
    }
    isCircuitOpen() {
        return Date.now() < this.cacheDisabledUntil;
    }
    openCircuit(error) {
        const firstTrip = !this.isCircuitOpen();
        this.cacheDisabledUntil = Date.now() + HttpCacheInterceptor_1.COOLDOWN_MS;
        if (firstTrip) {
            const message = error instanceof Error ? error.message : String(error);
            this.logger.warn(`Caché Redis no disponible; se omite por ${HttpCacheInterceptor_1.COOLDOWN_MS / 1000}s: ${message}`);
        }
    }
    async safeGet(key) {
        try {
            return await this.withTimeout(this.cache.get(key));
        }
        catch (error) {
            this.openCircuit(error);
            return undefined;
        }
    }
    async safeSet(key, value) {
        try {
            await this.withTimeout(this.cache.set(key, value));
        }
        catch (error) {
            this.openCircuit(error);
        }
    }
    withTimeout(promise) {
        return Promise.race([
            promise,
            new Promise((_resolve, reject) => setTimeout(() => reject(new Error('timeout de operación de caché')), HttpCacheInterceptor_1.OP_TIMEOUT_MS)),
        ]);
    }
};
exports.HttpCacheInterceptor = HttpCacheInterceptor;
exports.HttpCacheInterceptor = HttpCacheInterceptor = HttpCacheInterceptor_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(cache_manager_1.CACHE_MANAGER)),
    __metadata("design:paramtypes", [Object])
], HttpCacheInterceptor);
//# sourceMappingURL=http-cache.interceptor.js.map
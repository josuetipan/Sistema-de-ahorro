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
Object.defineProperty(exports, "__esModule", { value: true });
exports.JwtAuthTokenAdapter = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const jwt_access_secret_1 = require("./jwt-access-secret");
let JwtAuthTokenAdapter = class JwtAuthTokenAdapter {
    jwt;
    accessSecret;
    refreshSecret;
    accessExpires;
    refreshExpires;
    constructor(jwt) {
        this.jwt = jwt;
        this.accessSecret = (0, jwt_access_secret_1.getJwtAccessSecret)();
        this.refreshSecret =
            process.env.JWT_REFRESH_SECRET?.trim() ||
                process.env.JWT_SECRET?.trim() ||
                'dev-refresh-secret-change-me';
        this.accessExpires =
            process.env.JWT_ACCESS_EXPIRES?.trim() ||
                process.env.JWT_EXPIRES_IN?.trim() ||
                '1d';
        this.refreshExpires = process.env.JWT_REFRESH_EXPIRES?.trim() || '7d';
    }
    async createAccessToken(userId, roles) {
        return this.jwt.signAsync({ sub: userId, roles: [...roles] }, {
            secret: this.accessSecret,
            expiresIn: parseExpirationToSeconds(this.accessExpires),
        });
    }
    async createRefreshToken(userId) {
        return this.jwt.signAsync({ sub: userId, type: 'refresh' }, {
            secret: this.refreshSecret,
            expiresIn: parseExpirationToSeconds(this.refreshExpires),
        });
    }
    async verifyRefreshToken(token) {
        try {
            const payload = await this.jwt.verifyAsync(token, { secret: this.refreshSecret });
            if (payload.type !== 'refresh' || !payload.sub) {
                throw new common_1.UnauthorizedException();
            }
            return { userId: payload.sub };
        }
        catch {
            throw new common_1.UnauthorizedException('Refresh token inválido');
        }
    }
    getAccessExpiresInSeconds() {
        return parseExpirationToSeconds(this.accessExpires);
    }
};
exports.JwtAuthTokenAdapter = JwtAuthTokenAdapter;
exports.JwtAuthTokenAdapter = JwtAuthTokenAdapter = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [jwt_1.JwtService])
], JwtAuthTokenAdapter);
function parseExpirationToSeconds(expiration) {
    const trimmed = expiration.trim();
    const match = /^(\d+)\s*([dhms])$/i.exec(trimmed);
    if (!match) {
        return 15 * 60;
    }
    const value = parseInt(match[1], 10);
    const unit = match[2].toLowerCase();
    switch (unit) {
        case 'd':
            return value * 24 * 60 * 60;
        case 'h':
            return value * 60 * 60;
        case 'm':
            return value * 60;
        case 's':
            return value;
        default:
            return 15 * 60;
    }
}
//# sourceMappingURL=jwt-auth-token.adapter.js.map
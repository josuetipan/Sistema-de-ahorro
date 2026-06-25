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
Object.defineProperty(exports, "__esModule", { value: true });
exports.JwtAccessStrategy = void 0;
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
const passport_jwt_1 = require("passport-jwt");
const user_repository_port_1 = require("../../domain/ports/user.repository.port");
const maturity_util_1 = require("../../domain/maturity.util");
const jwt_access_secret_1 = require("./jwt-access-secret");
let JwtAccessStrategy = class JwtAccessStrategy extends (0, passport_1.PassportStrategy)(passport_jwt_1.Strategy, 'jwt') {
    users;
    constructor(users) {
        super({
            jwtFromRequest: passport_jwt_1.ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: (0, jwt_access_secret_1.getJwtAccessSecret)(),
        });
        this.users = users;
    }
    async validate(payload) {
        const user = await this.users.findById(payload.sub);
        if (!user || !user.isActive) {
            throw new common_1.UnauthorizedException('Usuario no encontrado o inactivo');
        }
        if ((0, maturity_util_1.isMaturityExpired)(user.maturityAt)) {
            throw new common_1.UnauthorizedException('Cuenta vencida');
        }
        return {
            id: user.id,
            usuario: user.usuario,
            email: user.email,
            fullName: user.fullName,
            cityId: user.cityId,
            cityName: user.cityName,
            roles: [...user.roles],
        };
    }
};
exports.JwtAccessStrategy = JwtAccessStrategy;
exports.JwtAccessStrategy = JwtAccessStrategy = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(user_repository_port_1.USER_REPOSITORY)),
    __metadata("design:paramtypes", [Object])
], JwtAccessStrategy);
//# sourceMappingURL=jwt-access.strategy.js.map
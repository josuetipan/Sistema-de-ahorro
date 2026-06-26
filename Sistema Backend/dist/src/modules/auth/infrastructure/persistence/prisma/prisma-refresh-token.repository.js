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
exports.PrismaRefreshTokenRepository = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../../../../shared/infrastructure/prisma/prisma.service");
let PrismaRefreshTokenRepository = class PrismaRefreshTokenRepository {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(userId, tokenHash, expiresAt) {
        const row = await this.prisma.passwordEncrypted.create({
            data: {
                id_usuario: userId,
                refresh: tokenHash,
                expires_at: expiresAt,
                revocado: false,
            },
        });
        return row.id_password_encrypted;
    }
    async revoke(id) {
        await this.prisma.passwordEncrypted.update({
            where: { id_password_encrypted: id },
            data: { revocado: true },
        });
    }
    async revokeAllForUser(userId) {
        await this.prisma.passwordEncrypted.updateMany({
            where: { id_usuario: userId, revocado: false },
            data: { revocado: true },
        });
    }
    async findMatchForUser(userId, plainRefreshToken, compare) {
        const rows = await this.prisma.passwordEncrypted.findMany({
            where: {
                id_usuario: userId,
                revocado: false,
                expires_at: { gt: new Date() },
            },
            orderBy: { createdAt: 'desc' },
        });
        for (const row of rows) {
            const match = await compare(plainRefreshToken, row.refresh);
            if (match) {
                return { id: row.id_password_encrypted };
            }
        }
        return null;
    }
};
exports.PrismaRefreshTokenRepository = PrismaRefreshTokenRepository;
exports.PrismaRefreshTokenRepository = PrismaRefreshTokenRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], PrismaRefreshTokenRepository);
//# sourceMappingURL=prisma-refresh-token.repository.js.map
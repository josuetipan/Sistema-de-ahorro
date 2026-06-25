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
exports.PrismaMetaConfigRepository = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../../../../shared/infrastructure/prisma/prisma.service");
function toConfig(row) {
    return {
        idConfiguracionMetaAhorro: row.id_configuracion_meta_ahorro,
        metaMensual: row.meta_mensual.toNumber(),
        metaMinima: row.meta_minima.toNumber(),
        metaMaxima: row.meta_maxima.toNumber(),
        updatedAt: row.updatedAt,
    };
}
let PrismaMetaConfigRepository = class PrismaMetaConfigRepository {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getOrCreate() {
        const existing = await this.prisma.configuracionMetaAhorro.findFirst({
            orderBy: { createdAt: 'asc' },
        });
        if (existing) {
            return toConfig(existing);
        }
        const created = await this.prisma.configuracionMetaAhorro.create({
            data: {},
        });
        return toConfig(created);
    }
    async actualizar(input) {
        const current = await this.getOrCreate();
        const data = {};
        if (input.metaMensual !== undefined) {
            data.meta_mensual = input.metaMensual;
        }
        if (input.metaMinima !== undefined) {
            data.meta_minima = input.metaMinima;
        }
        if (input.metaMaxima !== undefined) {
            data.meta_maxima = input.metaMaxima;
        }
        const row = await this.prisma.configuracionMetaAhorro.update({
            where: {
                id_configuracion_meta_ahorro: current.idConfiguracionMetaAhorro,
            },
            data,
        });
        return toConfig(row);
    }
};
exports.PrismaMetaConfigRepository = PrismaMetaConfigRepository;
exports.PrismaMetaConfigRepository = PrismaMetaConfigRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], PrismaMetaConfigRepository);
//# sourceMappingURL=prisma-meta-config.repository.js.map
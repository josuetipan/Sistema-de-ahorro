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
exports.PrismaBannerRepository = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../../../../shared/infrastructure/prisma/prisma.service");
function toResumen(row) {
    return {
        idBanner: row.id_banner,
        titulo: row.titulo,
        subtitulo: row.subtitulo,
        imagenUrl: row.imagen_url,
        orden: row.orden,
        activo: row.activo,
        createdAt: row.createdAt,
    };
}
let PrismaBannerRepository = class PrismaBannerRepository {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async listActive() {
        const rows = await this.prisma.banner.findMany({
            where: { activo: true },
            orderBy: [{ orden: 'asc' }, { createdAt: 'asc' }],
        });
        return rows.map(toResumen);
    }
    async listAll() {
        const rows = await this.prisma.banner.findMany({
            orderBy: [{ orden: 'asc' }, { createdAt: 'asc' }],
        });
        return rows.map(toResumen);
    }
    async create(input) {
        const row = await this.prisma.banner.create({
            data: {
                titulo: input.titulo,
                subtitulo: input.subtitulo ?? null,
                imagen_url: input.imagenUrl,
                orden: input.orden ?? undefined,
                activo: input.activo ?? undefined,
            },
        });
        return toResumen(row);
    }
    async findById(bannerId) {
        const row = await this.prisma.banner.findUnique({
            where: { id_banner: bannerId },
        });
        return row ? toResumen(row) : null;
    }
    async update(bannerId, input) {
        const data = {};
        if (input.titulo !== undefined) {
            data.titulo = input.titulo;
        }
        if (input.subtitulo !== undefined) {
            data.subtitulo = input.subtitulo;
        }
        if (input.imagenUrl !== undefined) {
            data.imagen_url = input.imagenUrl;
        }
        if (input.orden !== undefined) {
            data.orden = input.orden;
        }
        if (input.activo !== undefined) {
            data.activo = input.activo;
        }
        const row = await this.prisma.banner.update({
            where: { id_banner: bannerId },
            data,
        });
        return toResumen(row);
    }
    async delete(bannerId) {
        await this.prisma.banner.delete({ where: { id_banner: bannerId } });
    }
};
exports.PrismaBannerRepository = PrismaBannerRepository;
exports.PrismaBannerRepository = PrismaBannerRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], PrismaBannerRepository);
//# sourceMappingURL=prisma-banner.repository.js.map
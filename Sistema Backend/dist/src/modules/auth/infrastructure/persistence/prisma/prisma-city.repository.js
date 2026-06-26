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
exports.PrismaCityRepository = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../../../../shared/infrastructure/prisma/prisma.service");
let PrismaCityRepository = class PrismaCityRepository {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findActiveById(id) {
        const row = await this.prisma.city.findUnique({
            where: { id_city: id },
            select: { id_city: true, name: true, is_active: true },
        });
        if (!row?.is_active) {
            return null;
        }
        return { id: row.id_city, name: row.name };
    }
    async findActiveByName(name) {
        const row = await this.prisma.city.findFirst({
            where: { name, is_active: true },
            select: { id_city: true, name: true },
        });
        if (!row) {
            return null;
        }
        return { id: row.id_city, name: row.name };
    }
    async ensureActiveByName(name) {
        const row = await this.prisma.city.upsert({
            where: { name },
            create: { name, is_active: true },
            update: { is_active: true },
            select: { id_city: true, name: true },
        });
        return { id: row.id_city, name: row.name };
    }
};
exports.PrismaCityRepository = PrismaCityRepository;
exports.PrismaCityRepository = PrismaCityRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], PrismaCityRepository);
//# sourceMappingURL=prisma-city.repository.js.map
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
exports.PrismaRoleRepository = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../../../../shared/infrastructure/prisma/prisma.service");
let PrismaRoleRepository = class PrismaRoleRepository {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findIdByCode(code) {
        const row = await this.prisma.role.findFirst({
            where: {
                code_role: code,
                is_active: true,
            },
            select: { id_role: true },
        });
        return row?.id_role ?? null;
    }
    async existsByCodeRole(code) {
        const row = await this.prisma.role.findUnique({
            where: { code_role: code },
            select: { id_role: true },
        });
        return row !== null;
    }
    async existsByName(name) {
        const row = await this.prisma.role.findUnique({
            where: { name },
            select: { id_role: true },
        });
        return row !== null;
    }
    async create(input) {
        const row = await this.prisma.role.create({
            data: {
                name: input.name,
                code_role: input.codeRole,
                description: input.description,
                is_active: input.isActive,
            },
        });
        return {
            idRole: row.id_role,
            name: row.name,
            codeRole: row.code_role,
            description: row.description,
            isActive: row.is_active,
            createdAt: row.createdAt,
        };
    }
    async listActive() {
        const rows = await this.prisma.role.findMany({
            where: { is_active: true },
            orderBy: { name: 'asc' },
            select: {
                id_role: true,
                name: true,
                code_role: true,
                description: true,
            },
        });
        return rows.map((row) => ({
            idRole: row.id_role,
            name: row.name,
            codeRole: row.code_role,
            description: row.description,
        }));
    }
};
exports.PrismaRoleRepository = PrismaRoleRepository;
exports.PrismaRoleRepository = PrismaRoleRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], PrismaRoleRepository);
//# sourceMappingURL=prisma-role.repository.js.map
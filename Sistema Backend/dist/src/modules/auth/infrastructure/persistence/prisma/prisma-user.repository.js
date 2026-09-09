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
exports.PrismaUserRepository = void 0;
const common_1 = require("@nestjs/common");
const user_entity_1 = require("../../../domain/user.entity");
const prisma_service_1 = require("../../../../../shared/infrastructure/prisma/prisma.service");
const userInclude = { role: true, city: true };
let PrismaUserRepository = class PrismaUserRepository {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    toDomain(row) {
        if (!row.role?.is_active) {
            return null;
        }
        if (!row.city?.is_active) {
            return null;
        }
        return new user_entity_1.User(row.id_user, row.usuario, row.email, row.password_hash, row.full_name, row.role_id, [row.role.code_role], row.is_active, row.city_id, row.city.name, row.maturity_at, row.phone_number, row.identification, row.pending_password_reset);
    }
    async save(user) {
        await this.prisma.user.upsert({
            where: { usuario: user.usuario },
            create: {
                id_user: user.id,
                usuario: user.usuario,
                email: user.email ?? `${user.usuario}@local.invalid`,
                full_name: user.fullName,
                password_hash: user.passwordHash,
                role_id: user.roleId,
                city_id: user.cityId,
                maturity_at: user.maturityAt,
                phone_number: user.phoneNumber,
                identification: user.identification,
                is_active: user.isActive,
                pending_password_reset: user.pendingPasswordReset,
            },
            update: {
                email: user.email ?? `${user.usuario}@local.invalid`,
                password_hash: user.passwordHash,
                full_name: user.fullName,
                phone_number: user.phoneNumber,
                identification: user.identification,
                role_id: user.roleId,
                city_id: user.cityId,
                maturity_at: user.maturityAt,
                is_active: user.isActive,
                pending_password_reset: user.pendingPasswordReset,
            },
        });
    }
    async findByUsuario(usuario) {
        const row = await this.prisma.user.findUnique({
            where: { usuario: usuario.trim() },
            include: userInclude,
        });
        if (!row) {
            return null;
        }
        return this.toDomain(row);
    }
    async findByEmail(email) {
        const row = await this.prisma.user.findUnique({
            where: { email },
            include: userInclude,
        });
        if (!row) {
            return null;
        }
        return this.toDomain(row);
    }
    async findById(id) {
        const row = await this.prisma.user.findUnique({
            where: { id_user: id },
            include: userInclude,
        });
        if (!row) {
            return null;
        }
        return this.toDomain(row);
    }
    async touchLastLogin(id) {
        await this.prisma.user.update({
            where: { id_user: id },
            data: { last_login: new Date() },
        });
    }
    toAdminRecord(row) {
        return {
            id: row.id_user,
            usuario: row.usuario,
            email: row.email,
            fullName: row.full_name,
            identification: row.identification,
            phoneNumber: row.phone_number,
            roleCode: row.role.code_role,
            roleName: row.role.name,
            isActive: row.is_active,
            lastLogin: row.last_login,
            createdAt: row.createdAt,
        };
    }
    async listForAdmin() {
        const rows = await this.prisma.user.findMany({
            include: userInclude,
            orderBy: { createdAt: 'desc' },
        });
        return rows.map((row) => this.toAdminRecord(row));
    }
    async updateForAdmin(input) {
        const row = await this.prisma.user.update({
            where: { id_user: input.id },
            data: {
                ...(input.fullName === undefined ? {} : { full_name: input.fullName }),
                ...(input.email === undefined ? {} : { email: input.email }),
                ...(input.identification === undefined ? {} : { identification: input.identification }),
                ...(input.phoneNumber === undefined ? {} : { phone_number: input.phoneNumber }),
                ...(input.roleId === undefined ? {} : { role_id: input.roleId }),
                ...(input.address === undefined ? {} : { address: input.address }),
            },
            include: userInclude,
        });
        return this.toAdminRecord(row);
    }
    async setActiveForAdmin(id, isActive) {
        const row = await this.prisma.user.update({
            where: { id_user: id },
            data: { is_active: isActive },
            include: userInclude,
        });
        return this.toAdminRecord(row);
    }
};
exports.PrismaUserRepository = PrismaUserRepository;
exports.PrismaUserRepository = PrismaUserRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], PrismaUserRepository);
//# sourceMappingURL=prisma-user.repository.js.map
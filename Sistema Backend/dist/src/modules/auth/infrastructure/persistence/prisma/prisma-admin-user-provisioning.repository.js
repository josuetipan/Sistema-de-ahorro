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
exports.PrismaAdminUserProvisioningRepository = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../../../../shared/infrastructure/prisma/prisma.service");
let PrismaAdminUserProvisioningRepository = class PrismaAdminUserProvisioningRepository {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async createLinkedAdmin(input) {
        const adminRow = await this.prisma.$transaction(async (tx) => {
            await tx.user.create({
                data: {
                    id_user: input.userId,
                    usuario: input.usuario,
                    email: input.email,
                    password_hash: input.passwordHash,
                    full_name: input.fullName,
                    role_id: input.roleId,
                    city_id: input.cityId,
                    maturity_at: input.maturityAt,
                    phone_number: input.phoneNumber,
                    identification: input.identification,
                    is_active: true,
                    pending_password_reset: false,
                },
            });
            return tx.admin.create({
                data: {
                    user_id: input.userId,
                    full_name: input.fullName,
                    email: input.email,
                    identification: input.identification,
                },
            });
        });
        return { adminId: adminRow.id_admin };
    }
};
exports.PrismaAdminUserProvisioningRepository = PrismaAdminUserProvisioningRepository;
exports.PrismaAdminUserProvisioningRepository = PrismaAdminUserProvisioningRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], PrismaAdminUserProvisioningRepository);
//# sourceMappingURL=prisma-admin-user-provisioning.repository.js.map
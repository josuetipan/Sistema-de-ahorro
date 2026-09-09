"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ManageAdminUsersUseCase = void 0;
const user_role_1 = require("../../domain/user-role");
const ADMIN_ROLES = [
    user_role_1.UserRole.ADMIN,
    user_role_1.UserRole.CUSTOMER,
    user_role_1.UserRole.ACCOUNTANT,
];
class ManageAdminUsersUseCase {
    users;
    roles;
    constructor(users, roles) {
        this.users = users;
        this.roles = roles;
    }
    list() {
        return this.users.listForAdmin();
    }
    async update(input) {
        let roleId;
        if (input.roleCode !== undefined) {
            if (!ADMIN_ROLES.includes(input.roleCode)) {
                throw new Error('Rol no permitido');
            }
            roleId = (await this.roles.findIdByCode(input.roleCode)) ?? undefined;
            if (!roleId)
                throw new Error('Rol no encontrado');
        }
        return this.users.updateForAdmin({
            id: input.id,
            fullName: input.fullName?.trim(),
            email: input.email?.trim().toLowerCase(),
            identification: input.identification?.trim() || null,
            phoneNumber: input.phoneNumber?.trim() || null,
            roleId,
        });
    }
    setActive(id, isActive) {
        return this.users.setActiveForAdmin(id, isActive);
    }
}
exports.ManageAdminUsersUseCase = ManageAdminUsersUseCase;
//# sourceMappingURL=manage-admin-users.use-case.js.map
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
exports.AdminUsersController = void 0;
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
const user_role_1 = require("../../domain/user-role");
const roles_decorator_1 = require("../../infrastructure/auth/roles.decorator");
const roles_guard_1 = require("../../infrastructure/auth/roles.guard");
const manage_admin_users_use_case_1 = require("../../application/use-cases/manage-admin-users.use-case");
const update_admin_user_http_dto_1 = require("../dto/update-admin-user.http.dto");
let AdminUsersController = class AdminUsersController {
    manageUsers;
    constructor(manageUsers) {
        this.manageUsers = manageUsers;
    }
    list() {
        return this.manageUsers.list();
    }
    async update(id, body) {
        try {
            return await this.manageUsers.update({ ...body, id, roleCode: body.roleCode });
        }
        catch (error) {
            throw new common_1.NotFoundException(error instanceof Error ? error.message : 'Usuario no encontrado');
        }
    }
    async setActive(id, body) {
        try {
            return await this.manageUsers.setActive(id, body.isActive);
        }
        catch {
            throw new common_1.NotFoundException('Usuario no encontrado');
        }
    }
};
exports.AdminUsersController = AdminUsersController;
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AdminUsersController.prototype, "list", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_admin_user_http_dto_1.UpdateAdminUserHttpDto]),
    __metadata("design:returntype", Promise)
], AdminUsersController.prototype, "update", null);
__decorate([
    (0, common_1.Patch)(':id/status'),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_admin_user_http_dto_1.SetUserActiveHttpDto]),
    __metadata("design:returntype", Promise)
], AdminUsersController.prototype, "setActive", null);
exports.AdminUsersController = AdminUsersController = __decorate([
    (0, common_1.Controller)('auth/users'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt'), roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(user_role_1.UserRole.ADMIN),
    __metadata("design:paramtypes", [manage_admin_users_use_case_1.ManageAdminUsersUseCase])
], AdminUsersController);
//# sourceMappingURL=admin-users.controller.js.map
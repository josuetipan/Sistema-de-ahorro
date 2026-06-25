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
exports.RoleController = void 0;
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
const code_role_already_taken_error_1 = require("../../domain/code-role-already-taken.error");
const role_name_already_taken_error_1 = require("../../domain/role-name-already-taken.error");
const user_role_1 = require("../../domain/user-role");
const create_role_use_case_1 = require("../../application/use-cases/create-role.use-case");
const role_repository_port_1 = require("../../domain/ports/role.repository.port");
const roles_decorator_1 = require("../../infrastructure/auth/roles.decorator");
const roles_guard_1 = require("../../infrastructure/auth/roles.guard");
const create_role_http_dto_1 = require("../dto/create-role.http.dto");
let RoleController = class RoleController {
    createRole;
    roles;
    constructor(createRole, roles) {
        this.createRole = createRole;
        this.roles = roles;
    }
    async list() {
        const rows = await this.roles.listActive();
        return rows.map((row) => ({
            id: row.idRole,
            name: row.name,
            codeRole: row.codeRole,
            description: row.description,
        }));
    }
    async create(body) {
        try {
            const row = await this.createRole.execute({
                name: body.name,
                codeRole: body.codeRole,
                description: body.description,
                isActive: body.isActive,
            });
            return {
                id: row.idRole,
                name: row.name,
                codeRole: row.codeRole,
                description: row.description,
                isActive: row.isActive,
                createdAt: row.createdAt,
            };
        }
        catch (err) {
            if (err instanceof code_role_already_taken_error_1.CodeRoleAlreadyTakenError ||
                err instanceof role_name_already_taken_error_1.RoleNameAlreadyTakenError) {
                throw new common_1.ConflictException(err.message);
            }
            throw new common_1.InternalServerErrorException();
        }
    }
};
exports.RoleController = RoleController;
__decorate([
    (0, common_1.Get)(),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt'), roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(user_role_1.UserRole.ADMIN),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], RoleController.prototype, "list", null);
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt'), roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(user_role_1.UserRole.ADMIN),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_role_http_dto_1.CreateRoleHttpDto]),
    __metadata("design:returntype", Promise)
], RoleController.prototype, "create", null);
exports.RoleController = RoleController = __decorate([
    (0, common_1.Controller)('auth/roles'),
    __param(1, (0, common_1.Inject)(role_repository_port_1.ROLE_REPOSITORY)),
    __metadata("design:paramtypes", [create_role_use_case_1.CreateRoleUseCase, Object])
], RoleController);
//# sourceMappingURL=role.controller.js.map
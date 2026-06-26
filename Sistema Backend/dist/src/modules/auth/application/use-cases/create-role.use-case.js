"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateRoleUseCase = void 0;
const code_role_already_taken_error_1 = require("../../domain/code-role-already-taken.error");
const role_name_already_taken_error_1 = require("../../domain/role-name-already-taken.error");
class CreateRoleUseCase {
    roles;
    constructor(roles) {
        this.roles = roles;
    }
    async execute(input) {
        const name = input.name.trim();
        const codeRole = input.codeRole.trim().toUpperCase();
        if (await this.roles.existsByCodeRole(codeRole)) {
            throw new code_role_already_taken_error_1.CodeRoleAlreadyTakenError(codeRole);
        }
        if (await this.roles.existsByName(name)) {
            throw new role_name_already_taken_error_1.RoleNameAlreadyTakenError(name);
        }
        const description = input.description === undefined || input.description === null
            ? null
            : input.description.trim() || null;
        const isActive = input.isActive ?? true;
        return this.roles.create({
            name,
            codeRole,
            description,
            isActive,
        });
    }
}
exports.CreateRoleUseCase = CreateRoleUseCase;
//# sourceMappingURL=create-role.use-case.js.map
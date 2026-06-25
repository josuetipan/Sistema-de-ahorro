"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoleNameAlreadyTakenError = void 0;
class RoleNameAlreadyTakenError extends Error {
    name;
    constructor(name) {
        super(`El nombre de rol ya existe: ${name}`);
        this.name = name;
        this.name = 'RoleNameAlreadyTakenError';
    }
}
exports.RoleNameAlreadyTakenError = RoleNameAlreadyTakenError;
//# sourceMappingURL=role-name-already-taken.error.js.map
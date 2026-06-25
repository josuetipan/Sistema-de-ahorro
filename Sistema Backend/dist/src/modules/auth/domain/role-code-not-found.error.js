"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoleCodeNotFoundError = void 0;
class RoleCodeNotFoundError extends Error {
    code;
    constructor(code) {
        super(`No existe un rol activo con código: ${code}`);
        this.code = code;
        this.name = 'RoleCodeNotFoundError';
    }
}
exports.RoleCodeNotFoundError = RoleCodeNotFoundError;
//# sourceMappingURL=role-code-not-found.error.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CodeRoleAlreadyTakenError = void 0;
class CodeRoleAlreadyTakenError extends Error {
    code;
    constructor(code) {
        super(`El código de rol ya existe: ${code}`);
        this.code = code;
        this.name = 'CodeRoleAlreadyTakenError';
    }
}
exports.CodeRoleAlreadyTakenError = CodeRoleAlreadyTakenError;
//# sourceMappingURL=code-role-already-taken.error.js.map
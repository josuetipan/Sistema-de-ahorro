"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InvalidCredentialsError = void 0;
class InvalidCredentialsError extends Error {
    constructor(message = 'Credenciales inválidas') {
        super(message);
        this.name = 'InvalidCredentialsError';
    }
}
exports.InvalidCredentialsError = InvalidCredentialsError;
//# sourceMappingURL=invalid-credentials.error.js.map
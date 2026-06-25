"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InvalidRefreshTokenError = void 0;
class InvalidRefreshTokenError extends Error {
    constructor(message = 'Token de actualización inválido o expirado') {
        super(message);
        this.name = 'InvalidRefreshTokenError';
    }
}
exports.InvalidRefreshTokenError = InvalidRefreshTokenError;
//# sourceMappingURL=invalid-refresh-token.error.js.map
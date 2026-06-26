"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserNotFoundError = void 0;
class UserNotFoundError extends Error {
    constructor(message = 'Usuario no encontrado') {
        super(message);
        this.name = 'UserNotFoundError';
    }
}
exports.UserNotFoundError = UserNotFoundError;
//# sourceMappingURL=user-not-found.error.js.map
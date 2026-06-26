"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserInactiveError = void 0;
class UserInactiveError extends Error {
    constructor(message = 'Usuario inactivo') {
        super(message);
        this.name = 'UserInactiveError';
    }
}
exports.UserInactiveError = UserInactiveError;
//# sourceMappingURL=user-inactive.error.js.map
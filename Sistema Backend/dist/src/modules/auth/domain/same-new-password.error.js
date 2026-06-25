"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SameNewPasswordError = void 0;
class SameNewPasswordError extends Error {
    constructor(message = 'La nueva contraseña debe ser distinta a la actual') {
        super(message);
        this.name = 'SameNewPasswordError';
    }
}
exports.SameNewPasswordError = SameNewPasswordError;
//# sourceMappingURL=same-new-password.error.js.map
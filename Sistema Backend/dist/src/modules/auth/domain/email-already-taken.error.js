"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailAlreadyTakenError = void 0;
class EmailAlreadyTakenError extends Error {
    constructor(email) {
        super(`El correo ya está registrado: ${email}`);
        this.name = 'EmailAlreadyTakenError';
    }
}
exports.EmailAlreadyTakenError = EmailAlreadyTakenError;
//# sourceMappingURL=email-already-taken.error.js.map
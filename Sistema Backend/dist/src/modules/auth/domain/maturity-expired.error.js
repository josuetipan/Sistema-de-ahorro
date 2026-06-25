"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MaturityExpiredError = void 0;
class MaturityExpiredError extends Error {
    constructor(message = 'La vigencia de la cuenta ha expirado. No puedes iniciar sesión.') {
        super(message);
        this.name = 'MaturityExpiredError';
    }
}
exports.MaturityExpiredError = MaturityExpiredError;
//# sourceMappingURL=maturity-expired.error.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SocioCodigoAlreadyTakenError = void 0;
class SocioCodigoAlreadyTakenError extends Error {
    constructor(codigo) {
        super(`El código de referencia ya está en uso: ${codigo}`);
        this.name = 'SocioCodigoAlreadyTakenError';
    }
}
exports.SocioCodigoAlreadyTakenError = SocioCodigoAlreadyTakenError;
//# sourceMappingURL=socio-codigo-already-taken.error.js.map
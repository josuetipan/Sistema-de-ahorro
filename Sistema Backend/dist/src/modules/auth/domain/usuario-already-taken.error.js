"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsuarioAlreadyTakenError = void 0;
class UsuarioAlreadyTakenError extends Error {
    usuario;
    constructor(usuario) {
        super(`El usuario ya está registrado: ${usuario}`);
        this.usuario = usuario;
        this.name = 'UsuarioAlreadyTakenError';
    }
}
exports.UsuarioAlreadyTakenError = UsuarioAlreadyTakenError;
//# sourceMappingURL=usuario-already-taken.error.js.map
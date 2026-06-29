"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CuentaConSaldoError = exports.InvitacionNotFoundError = exports.BannerNotFoundError = exports.SaldoInsuficienteError = exports.MetaConfigInvalidaError = exports.SolicitudYaResueltaError = exports.SolicitudCuentaNotFoundError = exports.ComprobanteAlreadyTakenError = exports.AporteNotFoundError = exports.AporteMesAlreadyExistsError = exports.SocioNotFoundError = exports.CuentaForbiddenError = exports.CuentaNotFoundError = void 0;
class CuentaNotFoundError extends Error {
    constructor(cuentaId) {
        super(`No se encontró la cuenta: ${cuentaId}`);
        this.name = 'CuentaNotFoundError';
    }
}
exports.CuentaNotFoundError = CuentaNotFoundError;
class CuentaForbiddenError extends Error {
    constructor() {
        super('La cuenta no pertenece al usuario autenticado');
        this.name = 'CuentaForbiddenError';
    }
}
exports.CuentaForbiddenError = CuentaForbiddenError;
class SocioNotFoundError extends Error {
    constructor() {
        super('El usuario autenticado no tiene un socio asociado');
        this.name = 'SocioNotFoundError';
    }
}
exports.SocioNotFoundError = SocioNotFoundError;
class AporteMesAlreadyExistsError extends Error {
    constructor(mes) {
        super(`Ya existe un aporte registrado para el mes ${mes}`);
        this.name = 'AporteMesAlreadyExistsError';
    }
}
exports.AporteMesAlreadyExistsError = AporteMesAlreadyExistsError;
class AporteNotFoundError extends Error {
    constructor(aporteId) {
        super(`No se encontró el aporte: ${aporteId}`);
        this.name = 'AporteNotFoundError';
    }
}
exports.AporteNotFoundError = AporteNotFoundError;
class ComprobanteAlreadyTakenError extends Error {
    constructor() {
        super('El comprobante ya fue registrado anteriormente');
        this.name = 'ComprobanteAlreadyTakenError';
    }
}
exports.ComprobanteAlreadyTakenError = ComprobanteAlreadyTakenError;
class SolicitudCuentaNotFoundError extends Error {
    constructor(solicitudId) {
        super(`No se encontró la solicitud: ${solicitudId}`);
        this.name = 'SolicitudCuentaNotFoundError';
    }
}
exports.SolicitudCuentaNotFoundError = SolicitudCuentaNotFoundError;
class SolicitudYaResueltaError extends Error {
    constructor() {
        super('La solicitud ya fue resuelta');
        this.name = 'SolicitudYaResueltaError';
    }
}
exports.SolicitudYaResueltaError = SolicitudYaResueltaError;
class MetaConfigInvalidaError extends Error {
    constructor() {
        super('La meta mínima no puede ser mayor que la meta máxima');
        this.name = 'MetaConfigInvalidaError';
    }
}
exports.MetaConfigInvalidaError = MetaConfigInvalidaError;
class SaldoInsuficienteError extends Error {
    constructor() {
        super('La cuenta no tiene saldo suficiente para la operación');
        this.name = 'SaldoInsuficienteError';
    }
}
exports.SaldoInsuficienteError = SaldoInsuficienteError;
class BannerNotFoundError extends Error {
    constructor(bannerId) {
        super(`No se encontró el banner: ${bannerId}`);
        this.name = 'BannerNotFoundError';
    }
}
exports.BannerNotFoundError = BannerNotFoundError;
class InvitacionNotFoundError extends Error {
    constructor() {
        super('El usuario autenticado no tiene un código de invitación');
        this.name = 'InvitacionNotFoundError';
    }
}
exports.InvitacionNotFoundError = InvitacionNotFoundError;
class CuentaConSaldoError extends Error {
    constructor() {
        super('La cuenta tiene saldo; especifica una cuenta destino para transferir el saldo antes de eliminar');
        this.name = 'CuentaConSaldoError';
    }
}
exports.CuentaConSaldoError = CuentaConSaldoError;
//# sourceMappingURL=ahorro.errors.js.map
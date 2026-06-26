export declare class CuentaNotFoundError extends Error {
    constructor(cuentaId: string);
}
export declare class CuentaForbiddenError extends Error {
    constructor();
}
export declare class SocioNotFoundError extends Error {
    constructor();
}
export declare class AporteMesAlreadyExistsError extends Error {
    constructor(mes: string);
}
export declare class AporteNotFoundError extends Error {
    constructor(aporteId: string);
}
export declare class ComprobanteAlreadyTakenError extends Error {
    constructor();
}
export declare class SolicitudCuentaNotFoundError extends Error {
    constructor(solicitudId: string);
}
export declare class SolicitudYaResueltaError extends Error {
    constructor();
}
export declare class MetaConfigInvalidaError extends Error {
    constructor();
}
export declare class SaldoInsuficienteError extends Error {
    constructor();
}
export declare class CuentaConSaldoError extends Error {
    constructor();
}

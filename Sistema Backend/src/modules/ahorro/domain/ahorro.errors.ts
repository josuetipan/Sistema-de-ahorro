export class CuentaNotFoundError extends Error {
  constructor(cuentaId: string) {
    super(`No se encontró la cuenta: ${cuentaId}`);
    this.name = 'CuentaNotFoundError';
  }
}

export class CuentaForbiddenError extends Error {
  constructor() {
    super('La cuenta no pertenece al usuario autenticado');
    this.name = 'CuentaForbiddenError';
  }
}

export class SocioNotFoundError extends Error {
  constructor() {
    super('El usuario autenticado no tiene un socio asociado');
    this.name = 'SocioNotFoundError';
  }
}

export class AporteMesAlreadyExistsError extends Error {
  constructor(mes: string) {
    super(`Ya existe un aporte registrado para el mes ${mes}`);
    this.name = 'AporteMesAlreadyExistsError';
  }
}

export class AporteNotFoundError extends Error {
  constructor(aporteId: string) {
    super(`No se encontró el aporte: ${aporteId}`);
    this.name = 'AporteNotFoundError';
  }
}

export class ComprobanteAlreadyTakenError extends Error {
  constructor() {
    super('El comprobante ya fue registrado anteriormente');
    this.name = 'ComprobanteAlreadyTakenError';
  }
}

export class SolicitudCuentaNotFoundError extends Error {
  constructor(solicitudId: string) {
    super(`No se encontró la solicitud: ${solicitudId}`);
    this.name = 'SolicitudCuentaNotFoundError';
  }
}

export class SolicitudYaResueltaError extends Error {
  constructor() {
    super('La solicitud ya fue resuelta');
    this.name = 'SolicitudYaResueltaError';
  }
}

export class MetaConfigInvalidaError extends Error {
  constructor() {
    super('La meta mínima no puede ser mayor que la meta máxima');
    this.name = 'MetaConfigInvalidaError';
  }
}

export class SaldoInsuficienteError extends Error {
  constructor() {
    super('La cuenta no tiene saldo suficiente para la operación');
    this.name = 'SaldoInsuficienteError';
  }
}

export class CuentaConSaldoError extends Error {
  constructor() {
    super(
      'La cuenta tiene saldo; especifica una cuenta destino para transferir el saldo antes de eliminar',
    );
    this.name = 'CuentaConSaldoError';
  }
}

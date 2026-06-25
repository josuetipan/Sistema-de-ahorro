export class SocioCodigoAlreadyTakenError extends Error {
  constructor(codigo: string) {
    super(`El código de referencia ya está en uso: ${codigo}`);
    this.name = 'SocioCodigoAlreadyTakenError';
  }
}

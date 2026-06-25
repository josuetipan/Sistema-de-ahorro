export class UsuarioAlreadyTakenError extends Error {
  constructor(public readonly usuario: string) {
    super(`El usuario ya está registrado: ${usuario}`);
    this.name = 'UsuarioAlreadyTakenError';
  }
}

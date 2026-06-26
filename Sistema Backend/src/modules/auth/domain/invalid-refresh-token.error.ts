export class InvalidRefreshTokenError extends Error {
  constructor(message = 'Token de actualización inválido o expirado') {
    super(message);
    this.name = 'InvalidRefreshTokenError';
  }
}

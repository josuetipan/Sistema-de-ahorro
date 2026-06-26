export class MaturityExpiredError extends Error {
  constructor(
    message = 'La vigencia de la cuenta ha expirado. No puedes iniciar sesión.',
  ) {
    super(message);
    this.name = 'MaturityExpiredError';
  }
}

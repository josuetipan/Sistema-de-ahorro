export class SameNewPasswordError extends Error {
  constructor(
    message = 'La nueva contraseña debe ser distinta a la actual',
  ) {
    super(message);
    this.name = 'SameNewPasswordError';
  }
}

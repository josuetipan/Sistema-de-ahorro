export class EmailAlreadyTakenError extends Error {
  constructor(email: string) {
    super(`El correo ya está registrado: ${email}`);
    this.name = 'EmailAlreadyTakenError';
  }
}

export class RoleNameAlreadyTakenError extends Error {
  constructor(public readonly name: string) {
    super(`El nombre de rol ya existe: ${name}`);
    this.name = 'RoleNameAlreadyTakenError';
  }
}

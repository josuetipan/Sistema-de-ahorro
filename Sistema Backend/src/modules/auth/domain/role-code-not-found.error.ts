export class RoleCodeNotFoundError extends Error {
  constructor(public readonly code: string) {
    super(`No existe un rol activo con código: ${code}`);
    this.name = 'RoleCodeNotFoundError';
  }
}

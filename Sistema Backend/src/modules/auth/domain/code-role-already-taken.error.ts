export class CodeRoleAlreadyTakenError extends Error {
  constructor(public readonly code: string) {
    super(`El código de rol ya existe: ${code}`);
    this.name = 'CodeRoleAlreadyTakenError';
  }
}

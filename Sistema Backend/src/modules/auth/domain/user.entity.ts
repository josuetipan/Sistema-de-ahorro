export class User {
  constructor(
    public readonly id: string,
    public readonly usuario: string,
    public readonly email: string | null,
    public readonly passwordHash: string,
    public readonly fullName: string,
    public readonly roleId: string,
    /** Códigos de rol (`Role.code_role`) para JWT y autorización. */
    public readonly roles: readonly string[],
    public readonly isActive: boolean,
    public readonly cityId: string,
    public readonly cityName: string,
    public readonly maturityAt: Date,
    public readonly phoneNumber: string | null = null,
    public readonly identification: string | null = null,
    /** true hasta que el cliente complete el flujo de contraseña (p. ej. reset-password). */
    public readonly pendingPasswordReset: boolean = true,
  ) {}
}

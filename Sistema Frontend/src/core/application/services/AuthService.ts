// Servicio de aplicación para operaciones de autenticación
export class AuthService {
  constructor(private readonly loginFn: (email: string, password: string) => Promise<{ token: string; userId: string }>) {}

  async login(email: string, password: string): Promise<{ token: string; userId: string }> {
    return this.loginFn(email, password);
  }
}

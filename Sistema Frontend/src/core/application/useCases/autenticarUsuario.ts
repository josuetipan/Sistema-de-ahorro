// Caso de uso: autenticar usuario con credenciales
import type { AuthService } from '../services/AuthService';

export interface AutenticarUsuarioInput {
  email: string;
  password: string;
}

export async function autenticarUsuario(
  authService: AuthService,
  input: AutenticarUsuarioInput,
): Promise<{ token: string; userId: string }> {
  return authService.login(input.email, input.password);
}

import type { IAuthRepository } from '../../domain/auth.repository';
import type {
  AuthSession,
  LoginInput,
  RegisterInput,
  ResetPasswordInput,
  ResetPasswordResult,
} from '../../domain/auth.entity';
import { findMockCredential, MOCK_TOKEN } from '../mocks/auth.mock';

const delay = (ms = 500) => new Promise((resolve) => setTimeout(resolve, ms));

export class AuthMockAdapter implements IAuthRepository {
  async login(input: LoginInput): Promise<AuthSession> {
    await delay();

    const match = findMockCredential(input.email, input.password);

    if (!match) {
      // Simula un error 401 igual que haría el backend real
      const error = new Error('Correo o contraseña incorrectos.');
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (error as any).response = { status: 401, data: { message: 'Credenciales inválidas.' } };
      throw error;
    }

    return {
      user: match.user,
      token: MOCK_TOKEN,
    };
  }

  async register(input: RegisterInput): Promise<AuthSession> {
    await delay();
    // El registro no está habilitado en el prototipo
    const error = new Error('El registro no está disponible en el modo demo.');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (error as any).response = { status: 403, data: { message: 'Registro deshabilitado en demo.' } };
    throw error;
  }

  async logout(): Promise<void> {
    return;
  }

  async refreshToken(): Promise<{ token: string }> {
    return { token: MOCK_TOKEN };
  }

  async resetPassword(_input: ResetPasswordInput): Promise<ResetPasswordResult> {
    await delay();
    return { success: true, message: 'Contraseña actualizada' };
  }
}

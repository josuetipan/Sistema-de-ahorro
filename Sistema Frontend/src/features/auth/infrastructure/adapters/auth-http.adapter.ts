import type { IAuthRepository } from '../../domain/auth.repository';
import type { AuthSession, LoginInput, RegisterInput } from '../../domain/auth.entity';
import * as authApi from '../api/auth.api';
import { toAuthSession } from '../mappers/auth.mapper';

export class AuthHttpAdapter implements IAuthRepository {
  async login(input: LoginInput): Promise<AuthSession> {
    const response = await authApi.postLogin(input.email, input.password);
    return toAuthSession(response);
  }

  async register(input: RegisterInput): Promise<AuthSession> {
    const response = await authApi.postRegister(input);
    return toAuthSession(response);
  }

  async logout(): Promise<void> {
    await authApi.postLogout();
  }

  async refreshToken(): Promise<{ token: string }> {
    return authApi.postRefreshToken();
  }
}

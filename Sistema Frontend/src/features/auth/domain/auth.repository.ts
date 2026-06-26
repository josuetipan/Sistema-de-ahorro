import type { AuthSession, LoginInput, RegisterInput } from './auth.entity';

export interface IAuthRepository {
  login(input: LoginInput): Promise<AuthSession>;
  register(input: RegisterInput): Promise<AuthSession>;
  logout(): Promise<void>;
  refreshToken(): Promise<{ token: string }>;
}

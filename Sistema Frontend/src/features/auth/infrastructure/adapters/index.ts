import { env } from '@shared/config/env';
import type { IAuthRepository } from '../../domain/auth.repository';
import { AuthHttpAdapter } from './auth-http.adapter';
import { AuthMockAdapter } from './auth-mock.adapter';

export function createAuthRepository(): IAuthRepository {
  return env.VITE_MOCK_AUTH ? new AuthMockAdapter() : new AuthHttpAdapter();
}

export const authRepository = createAuthRepository();

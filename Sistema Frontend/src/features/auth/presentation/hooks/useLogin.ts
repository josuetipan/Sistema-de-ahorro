import { useCallback, useState } from 'react';
import { autenticarUsuarioUseCase } from '../../application/use-cases/autenticar-usuario.usecase';
import type { LoginFormData } from '../../application/schemas/login.schema';
import { authRepository } from '../../infrastructure/adapters';
import { useAuthStore } from './useAuthStore';

export function useLogin() {
  const loginStore = useAuthStore((s) => s.login);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const login = useCallback(
    async (data: LoginFormData) => {
      setIsSubmitting(true);
      try {
        const session = await autenticarUsuarioUseCase(authRepository, data);
        loginStore(session.user, session.token, session.refreshToken);
        return session;
      } finally {
        setIsSubmitting(false);
      }
    },
    [loginStore],
  );

  return { login, isSubmitting };
}

import { useCallback, useState } from 'react';
import { resetPasswordUseCase } from '../../application/use-cases/reset-password.usecase';
import type { ResetPasswordFormData } from '../../application/schemas/reset-password.schema';
import type { ResetPasswordResult } from '../../domain/auth.entity';
import { authRepository } from '../../infrastructure/adapters';
import { useAuthStore } from './useAuthStore';

export function useResetPassword() {
  const user = useAuthStore((s) => s.user);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const resetPassword = useCallback(
    async (data: ResetPasswordFormData): Promise<ResetPasswordResult> => {
      if (!user) {
        throw new Error('No hay una sesión activa.');
      }
      setIsSubmitting(true);
      try {
        return await resetPasswordUseCase(authRepository, {
          idUsuario: user.id,
          currentPassword: data.currentPassword,
          newPassword: data.newPassword,
        });
      } finally {
        setIsSubmitting(false);
      }
    },
    [user],
  );

  return { resetPassword, isSubmitting };
}

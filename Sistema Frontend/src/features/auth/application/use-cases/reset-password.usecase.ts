import type { IAuthRepository } from '../../domain/auth.repository';
import type { ResetPasswordInput, ResetPasswordResult } from '../../domain/auth.entity';

export async function resetPasswordUseCase(
  repository: IAuthRepository,
  input: ResetPasswordInput,
): Promise<ResetPasswordResult> {
  return repository.resetPassword(input);
}

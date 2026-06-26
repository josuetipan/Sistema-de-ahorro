import type { IAuthRepository } from '../../domain/auth.repository';
import type { LoginInput } from '../../domain/auth.entity';
import type { AuthSession } from '../../domain/auth.entity';

export async function autenticarUsuarioUseCase(
  repository: IAuthRepository,
  input: LoginInput,
): Promise<AuthSession> {
  return repository.login(input);
}

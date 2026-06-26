import type { IAuthRepository } from '../../domain/auth.repository';
import type { AuthSession, RegisterInput } from '../../domain/auth.entity';

export async function registrarUsuarioUseCase(
  repository: IAuthRepository,
  input: RegisterInput,
): Promise<AuthSession> {
  return repository.register(input);
}

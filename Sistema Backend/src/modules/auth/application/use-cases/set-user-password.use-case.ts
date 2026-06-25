import * as bcrypt from 'bcrypt';
import { User } from '../../domain/user.entity';
import { UserNotFoundError } from '../../domain/user-not-found.error';
import type { UserRepositoryPort } from '../../domain/ports/user.repository.port';
import type { RefreshTokenRepositoryPort } from '../../domain/ports/refresh-token.repository.port';

export interface SetUserPasswordInput {
  /** `id_user` del usuario a actualizar. */
  userId: string;
  newPassword: string;
}

const SALT_ROUNDS = 10;

/**
 * Asigna una nueva contraseña por id y deja `pending_password_reset` en true
 * (el usuario debe completar el flujo de restablecimiento).
 */
export class SetUserPasswordUseCase {
  constructor(
    private readonly users: UserRepositoryPort,
    private readonly refreshRepo: RefreshTokenRepositoryPort,
  ) {}

  async execute(input: SetUserPasswordInput): Promise<void> {
    const user = await this.users.findById(input.userId.trim());
    if (!user) {
      throw new UserNotFoundError();
    }

    const passwordHash = await bcrypt.hash(input.newPassword, SALT_ROUNDS);
    const updated = new User(
      user.id,
      user.usuario,
      user.email,
      passwordHash,
      user.fullName,
      user.roleId,
      user.roles,
      user.isActive,
      user.cityId,
      user.cityName,
      user.maturityAt,
      user.phoneNumber,
      user.identification,
      true,
    );
    await this.users.save(updated);
    await this.refreshRepo.revokeAllForUser(user.id);
  }
}

import * as bcrypt from 'bcrypt';
import { User } from '../../domain/user.entity';
import { InvalidCredentialsError } from '../../domain/invalid-credentials.error';
import { UserNotFoundError } from '../../domain/user-not-found.error';
import { SameNewPasswordError } from '../../domain/same-new-password.error';
import type { UserRepositoryPort } from '../../domain/ports/user.repository.port';
import type { RefreshTokenRepositoryPort } from '../../domain/ports/refresh-token.repository.port';

export interface ChangePasswordInput {
  /** `id_user` del usuario. */
  userId: string;
  /**
   * Contraseña actual.
   * - Si se envía: se valida y el usuario deja de estar pendiente (`pending_password_reset = false`).
   * - Si NO se envía: se cambia sin validar y queda pendiente (`pending_password_reset = true`),
   *   para forzar el cambio en el próximo inicio de sesión.
   */
  currentPassword?: string;
  newPassword: string;
}

const SALT_ROUNDS = 10;

export class ChangePasswordUseCase {
  constructor(
    private readonly users: UserRepositoryPort,
    private readonly refreshRepo: RefreshTokenRepositoryPort,
  ) {}

  async execute(input: ChangePasswordInput): Promise<void> {
    const user = await this.users.findById(input.userId.trim());
    if (!user) {
      throw new UserNotFoundError();
    }
    if (!user.isActive) {
      throw new InvalidCredentialsError();
    }

    const tieneCurrentPassword = Boolean(input.currentPassword?.trim());
    let pendingPasswordReset: boolean;

    if (tieneCurrentPassword) {
      const ok = await bcrypt.compare(
        input.currentPassword as string,
        user.passwordHash,
      );
      if (!ok) {
        throw new InvalidCredentialsError('Contraseña actual incorrecta');
      }
      if (input.newPassword === input.currentPassword) {
        throw new SameNewPasswordError();
      }
      pendingPasswordReset = false;
    } else {
      pendingPasswordReset = true;
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
      pendingPasswordReset,
    );
    await this.users.save(updated);
    await this.refreshRepo.revokeAllForUser(user.id);
  }
}

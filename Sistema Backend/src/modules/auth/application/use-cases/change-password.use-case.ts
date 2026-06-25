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
  currentPassword: string;
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
    const ok = await bcrypt.compare(
      input.currentPassword,
      user.passwordHash,
    );
    if (!ok) {
      throw new InvalidCredentialsError('Contraseña actual incorrecta');
    }
    if (input.newPassword === input.currentPassword) {
      throw new SameNewPasswordError();
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
      false,
    );
    await this.users.save(updated);
    await this.refreshRepo.revokeAllForUser(user.id);
  }
}

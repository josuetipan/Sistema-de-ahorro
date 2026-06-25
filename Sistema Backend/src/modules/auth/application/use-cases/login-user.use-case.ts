import * as bcrypt from 'bcrypt';
import { InvalidCredentialsError } from '../../domain/invalid-credentials.error';
import { UserInactiveError } from '../../domain/user-inactive.error';
import { MaturityExpiredError } from '../../domain/maturity-expired.error';
import { isMaturityExpired } from '../../domain/maturity.util';
import type { UserRepositoryPort } from '../../domain/ports/user.repository.port';
import type { RefreshTokenRepositoryPort } from '../../domain/ports/refresh-token.repository.port';
import type { AuthTokenPort } from '../../domain/ports/auth-token.port';
import { buildAuthSession } from './build-auth-session';
import type { AuthSessionDto } from './auth-session.dto';

export interface LoginUserInput {
  usuario: string;
  password: string;
}

export class LoginUserUseCase {
  constructor(
    private readonly users: UserRepositoryPort,
    private readonly refreshRepo: RefreshTokenRepositoryPort,
    private readonly tokens: AuthTokenPort,
  ) {}

  async execute(input: LoginUserInput): Promise<AuthSessionDto> {
    const identifier = input.usuario.trim();
    let user = await this.users.findByUsuario(identifier);
    if (!user) {
      user = await this.users.findByEmail(identifier);
    }
    if (!user) {
      throw new InvalidCredentialsError();
    }
    if (!user.isActive) {
      throw new UserInactiveError();
    }
    if (isMaturityExpired(user.maturityAt)) {
      throw new MaturityExpiredError();
    }
    const ok = await bcrypt.compare(input.password, user.passwordHash);
    if (!ok) {
      throw new InvalidCredentialsError();
    }

    await this.refreshRepo.revokeAllForUser(user.id);
    await this.users.touchLastLogin(user.id);
    return buildAuthSession(user, this.tokens, this.refreshRepo);
  }
}

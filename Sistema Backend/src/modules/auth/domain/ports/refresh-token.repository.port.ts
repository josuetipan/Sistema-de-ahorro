export const REFRESH_TOKEN_REPOSITORY = Symbol('REFRESH_TOKEN_REPOSITORY');

export interface RefreshTokenRepositoryPort {
  create(userId: string, tokenHash: string, expiresAt: Date): Promise<string>;
  revoke(id: string): Promise<void>;
  revokeAllForUser(userId: string): Promise<void>;
  /** Busca un refresh válido para el usuario comparando el token en claro con el hash almacenado. */
  findMatchForUser(
    userId: string,
    plainRefreshToken: string,
    compare: (plain: string, hash: string) => Promise<boolean>,
  ): Promise<{ id: string } | null>;
}

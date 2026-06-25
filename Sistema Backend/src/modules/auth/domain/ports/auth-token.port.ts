export const AUTH_TOKEN_PORT = Symbol('AUTH_TOKEN_PORT');

export interface AuthTokenPort {
  createAccessToken(
    userId: string,
    roles: readonly string[],
  ): Promise<string>;
  createRefreshToken(userId: string): Promise<string>;
  verifyRefreshToken(token: string): Promise<{ userId: string }>;
  getAccessExpiresInSeconds(): number;
}

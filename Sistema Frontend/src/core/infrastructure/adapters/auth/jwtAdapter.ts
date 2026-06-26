// Adaptador para decodificar y validar tokens JWT en el cliente
export interface JwtPayload {
  sub: string;
  exp: number;
  iat?: number;
}

export class JwtAdapter {
  decode(token: string): JwtPayload | null {
    try {
      const payload = token.split('.')[1];
      if (!payload) return null;
      return JSON.parse(atob(payload)) as JwtPayload;
    } catch {
      return null;
    }
  }

  isExpired(token: string): boolean {
    const payload = this.decode(token);
    if (!payload?.exp) return true;
    return Date.now() >= payload.exp * 1000;
  }
}

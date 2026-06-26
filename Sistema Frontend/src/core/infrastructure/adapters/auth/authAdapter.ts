// Adaptador de autenticación que coordina JWT y almacenamiento local
import { JwtAdapter } from './jwtAdapter';
import { LocalStorageAdapter } from '../storage/localStorageAdapter';
import { STORAGE_KEYS } from '@shared/lib/constants';

export class AuthAdapter {
  private jwt = new JwtAdapter();
  private storage = new LocalStorageAdapter();

  saveToken(token: string): void {
    this.storage.set(STORAGE_KEYS.AUTH_TOKEN, token);
  }

  getToken(): string | null {
    return this.storage.get<string>(STORAGE_KEYS.AUTH_TOKEN);
  }

  clearSession(): void {
    this.storage.remove(STORAGE_KEYS.AUTH_TOKEN);
    this.storage.remove(STORAGE_KEYS.USER);
  }

  isSessionValid(): boolean {
    const token = this.getToken();
    if (!token) return false;
    return !this.jwt.isExpired(token);
  }
}

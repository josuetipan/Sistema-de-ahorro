// Adaptador de persistencia usando sessionStorage del navegador
export class SessionAdapter {
  get<T>(key: string): T | null {
    const raw = sessionStorage.getItem(key);
    if (!raw) return null;
    try {
      return JSON.parse(raw) as T;
    } catch {
      return null;
    }
  }

  set<T>(key: string, value: T): void {
    sessionStorage.setItem(key, JSON.stringify(value));
  }

  clear(): void {
    sessionStorage.clear();
  }
}

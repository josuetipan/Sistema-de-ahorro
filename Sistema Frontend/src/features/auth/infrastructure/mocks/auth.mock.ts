import type { Usuario } from '@entities/usuario/model';

export const MOCK_TOKEN = 'mock-dev-token';

// ── Credenciales fijas del prototipo ──────────────────────────────────────
// Solo estos dos usuarios pueden ingresar al sistema.
// Cualquier otra combinación de email/contraseña es rechazada.
export const MOCK_CREDENTIALS: Array<{
  email: string;
  password: string;
  user: Usuario;
}> = [
  {
    email: 'admin@ahorro.local',
    password: 'Admin2024*',
    user: {
      id: 'usr-1',
      email: 'admin@ahorro.local',
      nombre: 'Carlos Mendoza',
      rol: 'admin',
      activo: true,
      createdAt: new Date().toISOString(),
      perfil: {
        telefono: '5512345678',
        direccion: 'Av. Principal 100, Quito',
        fotoPerfil: 'https://api.dicebear.com/7.x/personas/png?seed=carlos-mendoza&backgroundColor=b6e3f4',
      },
    },
  },
  {
    email: 'operador@ahorro.local',
    password: 'Operador2024*',
    user: {
      id: 'usr-2',
      email: 'operador@ahorro.local',
      nombre: 'Operador Principal',
      rol: 'operador',
      activo: true,
      createdAt: new Date().toISOString(),
      perfil: {
        telefono: '5598765432',
        direccion: 'Calle Secundaria 45, Quito',
        fotoPerfil: 'https://api.dicebear.com/7.x/personas/png?seed=operador-principal&backgroundColor=c0aede',
      },
    },
  },
  {
    email: 'usuario@ahorro.local',
    password: 'Usuario2024*',
    user: {
      id: 'usr-3',
      email: 'usuario@ahorro.local',
      nombre: 'María González',
      rol: 'cliente',
      activo: true,
      createdAt: new Date().toISOString(),
      perfil: {
        telefono: '5512345678',
        direccion: 'Calle Principal 123, CDMX',
        fotoPerfil: 'https://api.dicebear.com/7.x/personas/png?seed=maria-gonzalez&backgroundColor=ffd5dc',
      },
    },
  },
  {
    email: 'contador@ahorro.local',
    password: 'Contador2024*',
    user: {
      id: 'usr-5',
      email: 'contador@ahorro.local',
      nombre: 'Ana Contadora',
      rol: 'contador',
      activo: true,
      createdAt: new Date().toISOString(),
      perfil: {
        telefono: '5511223344',
        direccion: 'Oficina contable, Quito',
        fotoPerfil: 'https://api.dicebear.com/7.x/personas/png?seed=ana-contadora&backgroundColor=d1fae5',
      },
    },
  },
];

export function isMockToken(token: string | null): boolean {
  return token?.startsWith('mock-') ?? false;
}

/**
 * Busca las credenciales en la lista fija.
 * Devuelve el usuario si email y contraseña coinciden exactamente.
 * Devuelve null si no existe o la contraseña es incorrecta.
 */
export function findMockCredential(email: string, password: string) {
  const normalized = email.trim().toLowerCase();
  return (
    MOCK_CREDENTIALS.find(
      (c) => c.email.toLowerCase() === normalized && c.password === password,
    ) ?? null
  );
}

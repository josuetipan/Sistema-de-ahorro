import type { Rol, Usuario } from '@entities/usuario/model';
import type { AuthSession } from '../../domain/auth.entity';
import type { BackendUser, LoginResponseBody } from '../dtos/auth.dto';

/** Traduce los roles del backend (inglés/mayúsculas) al rol de dominio. */
function mapRol(roles: string[]): Rol {
  const normalizados = roles.map((r) => r.toUpperCase());
  if (normalizados.includes('ADMIN')) return 'admin';
  if (normalizados.includes('OPERATOR')) return 'operador';
  if (normalizados.includes('CUSTOMER')) return 'cliente';
  return 'cliente';
}

function toUsuario(user: BackendUser): Usuario {
  return {
    id: user.id,
    email: user.email,
    nombre: user.fullName,
    rol: mapRol(user.roles),
    activo: user.isActive,
    createdAt: '',
    pendingPasswordReset: user.pending_password_reset,
  };
}

export function toAuthSession(body: LoginResponseBody): AuthSession {
  return {
    user: toUsuario(body.user),
    token: body.accessToken,
  };
}

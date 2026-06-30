export type { Rol, Usuario } from '@entities/usuario/model';

export interface AuthSession {
  user: import('@entities/usuario/model').Usuario;
  token: string;
  refreshToken: string;
  expiresIn?: number;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface RegisterInput {
  nombre: string;
  email: string;
  password: string;
}

export interface ResetPasswordInput {
  idUsuario: string;
  currentPassword: string;
  newPassword: string;
}

export interface ResetPasswordResult {
  success: boolean;
  message: string;
}

/** Envoltura estándar de las respuestas del backend */
export interface BackendEnvelope<T> {
  code: number;
  status: string;
  body: T;
}

/** Forma del usuario tal como lo devuelve el backend */
export interface BackendUser {
  id: string;
  usuario: string;
  identification: string;
  email: string;
  fullName: string;
  cityId: string;
  cityName: string;
  roles: string[];
  isActive: boolean;
  pending_password_reset: boolean;
  maturityAt: string;
}

/** Cuerpo (body) de la respuesta de login */
export interface LoginResponseBody {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  user: BackendUser;
}

export interface RegisterDTO {
  fullName: string;
  identification: string;
  email: string;
  phoneNumber: string;
  roleCode: 'CUSTOMER';
  password: string;
}

export interface RegisterResponseBody {
  id: string;
  usuario: string;
  email: string;
  fullName: string;
  phoneNumber: string;
  identification: string;
  cityId: string;
  cityName: string;
  roles: string[];
  socio: {
    id: string;
    codigo: string;
    estado: string;
  };
  invitacion: {
    id: string;
    codigo: string;
    activo: boolean;
  };
  pendingPasswordReset: boolean;
}

/** Petición de cambio de contraseña */
export interface ResetPasswordRequest {
  idUsuario: string;
  currentPassword?: string;
  newPassword: string;
}

/** Cuerpo (body) de la respuesta de cambio de contraseña */
export interface ResetPasswordResponseBody {
  success: boolean;
  message: string;
}

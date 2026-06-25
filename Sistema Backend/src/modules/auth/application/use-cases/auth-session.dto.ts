export interface AuthSessionDto {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  user: {
    id: string;
    usuario: string;
    identification: string | null;
    email: string | null;
    fullName: string;
    cityId: string;
    cityName: string;
    roles: string[];
    isActive: boolean;
    pending_password_reset: boolean;
    /** Fecha de vencimiento de la licencia (ISO 8601). */
    maturityAt: string;
  };
}

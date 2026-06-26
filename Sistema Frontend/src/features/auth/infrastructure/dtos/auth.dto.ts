import type { Usuario } from '@entities/usuario/model';

export interface AuthResponseDTO {
  user: Usuario;
  token: string;
}

export interface RegisterDTO {
  nombre: string;
  email: string;
  password: string;
}

// Tipos del slice usuario: Usuario, Rol y Perfil
export type Rol = 'admin' | 'cliente' | 'operador' | 'contador';

export interface Perfil {
  telefono?: string;
  direccion?: string;
  fechaNacimiento?: string;
  fotoPerfil?: string;
}

export interface Usuario {
  id: string;
  email: string;
  nombre: string;
  rol: Rol;
  perfil?: Perfil;
  activo: boolean;
  createdAt: string;
}

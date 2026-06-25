// Puerto del dominio: contrato de persistencia de usuarios
import type { Usuario } from '../entities/Usuario';

export interface IUsuarioRepository {
  findById(id: string): Promise<Usuario | null>;
  findAll(): Promise<Usuario[]>;
  save(usuario: Usuario): Promise<Usuario>;
  update(usuario: Usuario): Promise<Usuario>;
  delete(id: string): Promise<void>;
}

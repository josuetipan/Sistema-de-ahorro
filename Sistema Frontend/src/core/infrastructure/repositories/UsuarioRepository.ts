// Implementación concreta del puerto IUsuarioRepository vía HTTP
import type { IUsuarioRepository } from '@core/domain/ports/IUsuarioRepository';
import type { Usuario } from '@core/domain/entities/Usuario';
import { HttpAdapter } from '../adapters/http/httpAdapter';
import { API_CONFIG } from '@shared/config/api';
import { toDomainUsuario } from '../mappers/usuarioMapper';
import type { UsuarioDTO } from '@core/application/dtos';

export class UsuarioRepository implements IUsuarioRepository {
  constructor(private readonly http = new HttpAdapter()) {}

  async findById(id: string): Promise<Usuario | null> {
    const dto = await this.http.get<UsuarioDTO>(`${API_CONFIG.endpoints.usuarios}/${id}`);
    return toDomainUsuario(dto);
  }

  async findAll(): Promise<Usuario[]> {
    const list = await this.http.get<UsuarioDTO[]>(API_CONFIG.endpoints.usuarios);
    return list.map(toDomainUsuario);
  }

  async save(usuario: Usuario): Promise<Usuario> {
    const dto = await this.http.post<UsuarioDTO>(API_CONFIG.endpoints.usuarios, usuario);
    return toDomainUsuario(dto);
  }

  async update(usuario: Usuario): Promise<Usuario> {
    const dto = await this.http.patch<UsuarioDTO>(
      `${API_CONFIG.endpoints.usuarios}/${usuario.id}`,
      usuario,
    );
    return toDomainUsuario(dto);
  }

  async delete(id: string): Promise<void> {
    await this.http.delete(`${API_CONFIG.endpoints.usuarios}/${id}`);
  }
}

// Mapper: transforma datos de API a entidad de dominio Usuario
import { Usuario } from '@core/domain/entities/Usuario';
import type { UsuarioDTO } from '@core/application/dtos';

export function toDomainUsuario(dto: UsuarioDTO): Usuario {
  return new Usuario({
    id: dto.id,
    email: dto.email,
    nombre: dto.nombre,
    rol: dto.rol,
    activo: true,
  });
}

export function toDTOUsuario(usuario: Usuario): UsuarioDTO {
  return {
    id: usuario.id,
    email: usuario.email,
    nombre: usuario.nombre,
    rol: usuario.rol,
  };
}

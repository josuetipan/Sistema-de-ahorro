import { IsString, IsUUID, MinLength } from 'class-validator';

export class ChangePasswordHttpDto {
  /** Debe coincidir con el `id` del usuario autenticado (JWT `sub`). */
  @IsUUID('4', { message: 'idUsuario debe ser un UUID válido' })
  idUsuario!: string;

  @IsString()
  @MinLength(1, { message: 'La contraseña actual es obligatoria' })
  currentPassword!: string;

  @IsString()
  @MinLength(8, { message: 'La nueva contraseña debe tener al menos 8 caracteres' })
  newPassword!: string;
}

import { IsOptional, IsString, IsUUID, MinLength } from 'class-validator';

export class ChangePasswordHttpDto {
  /** Debe coincidir con el `id` del usuario autenticado (JWT `sub`). */
  @IsUUID('4', { message: 'idUsuario debe ser un UUID válido' })
  idUsuario!: string;

  /**
   * Contraseña actual (opcional).
   * - Si se envía: se valida y el estado queda en `pending_password_reset = false`.
   * - Si se omite: se cambia sin validar y queda en `pending_password_reset = true`.
   */
  @IsOptional()
  @IsString()
  @MinLength(1, { message: 'La contraseña actual no puede estar vacía' })
  currentPassword?: string;

  @IsString()
  @MinLength(8, { message: 'La nueva contraseña debe tener al menos 8 caracteres' })
  newPassword!: string;
}

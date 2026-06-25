import { Transform } from 'class-transformer';
import { IsString, IsUUID, MinLength } from 'class-validator';

export class SetUserPasswordHttpDto {
  @IsUUID('4', { message: 'idUsuario debe ser un UUID válido' })
  idUsuario!: string;

  @Transform(({ value }) =>
    typeof value === 'string' ? value.trim() : value,
  )
  @IsString()
  @MinLength(8, { message: 'La nueva contraseña debe tener al menos 8 caracteres' })
  newPassword!: string;
}

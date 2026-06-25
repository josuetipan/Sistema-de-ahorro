import {
  IsIn,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
  Min,
} from 'class-validator';
import type { TipoSolicitudCuenta } from '@prisma/client';

const TIPOS: TipoSolicitudCuenta[] = ['eliminacion', 'retiro'];

export class CrearSolicitudHttpDto {
  @IsIn(TIPOS, { message: `tipo debe ser uno de: ${TIPOS.join(', ')}` })
  tipo!: TipoSolicitudCuenta;

  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 }, { message: 'monto debe ser numérico' })
  @Min(0.01, { message: 'monto debe ser mayor a 0' })
  monto?: number;

  @IsOptional()
  @IsUUID(undefined, { message: 'cuentaDestinoId debe ser un UUID válido' })
  cuentaDestinoId?: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  motivo?: string;
}

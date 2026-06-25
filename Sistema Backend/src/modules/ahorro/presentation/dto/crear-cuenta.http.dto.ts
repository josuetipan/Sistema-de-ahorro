import { Transform } from 'class-transformer';
import {
  IsIn,
  IsOptional,
  IsString,
  Length,
  MaxLength,
  MinLength,
} from 'class-validator';
import type { TipoCuenta } from '@prisma/client';

const TIPOS: TipoCuenta[] = ['ahorro', 'corriente', 'credito'];

export class CrearCuentaHttpDto {
  @IsString()
  @MinLength(1, { message: 'El nombre de la cuenta es requerido' })
  @MaxLength(60, { message: 'El nombre admite como máximo 60 caracteres' })
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  nombre!: string;

  @IsOptional()
  @IsIn(TIPOS, { message: `tipo debe ser uno de: ${TIPOS.join(', ')}` })
  tipo?: TipoCuenta;

  @IsOptional()
  @IsString()
  @Length(3, 3, { message: 'moneda debe tener 3 caracteres (ej: MXN)' })
  @Transform(({ value }) =>
    typeof value === 'string' ? value.trim().toUpperCase() : value,
  )
  moneda?: string;

  @IsOptional()
  @IsString()
  @MaxLength(20)
  color?: string;

  @IsOptional()
  @IsString()
  @MaxLength(40)
  icono?: string;
}

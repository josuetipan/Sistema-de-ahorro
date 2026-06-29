import { Transform, Type } from 'class-transformer';
import {
  IsNumber,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  Min,
} from 'class-validator';

// El comprobante se sube como archivo (form-data, campo `archivo`); el resto
// de campos llegan como texto en el mismo form-data.
export class RegistrarAporteHttpDto {
  @Matches(/^\d{4}-(0[1-9]|1[0-2])$/, {
    message: 'mes debe tener el formato YYYY-MM',
  })
  mes!: string;

  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 }, { message: 'monto debe ser numérico' })
  @Min(0.01, { message: 'monto debe ser mayor a 0' })
  monto!: number;

  @IsString()
  @MaxLength(120, { message: 'comprobante admite como máximo 120 caracteres' })
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  comprobante!: string;

  @IsOptional()
  @IsString()
  @MaxLength(120)
  referencia?: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  archivoNombre?: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  descripcion?: string;
}

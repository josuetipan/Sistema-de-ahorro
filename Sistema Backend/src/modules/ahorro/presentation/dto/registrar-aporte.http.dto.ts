import { Transform } from 'class-transformer';
import {
  IsNumber,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  Min,
} from 'class-validator';

export class RegistrarAporteHttpDto {
  @Matches(/^\d{4}-(0[1-9]|1[0-2])$/, {
    message: 'mes debe tener el formato YYYY-MM',
  })
  mes!: string;

  @IsNumber({ maxDecimalPlaces: 2 }, { message: 'monto debe ser numérico' })
  @Min(0.01, { message: 'monto debe ser mayor a 0' })
  monto!: number;

  @IsString()
  @MaxLength(120, { message: 'comprobante admite como máximo 120 caracteres' })
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  comprobante!: string;

  @IsString()
  @MaxLength(500, { message: 'urlArchivo admite como máximo 500 caracteres' })
  urlArchivo!: string;

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

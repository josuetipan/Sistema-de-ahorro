import { Transform, Type } from 'class-transformer';
import {
  IsBoolean,
  IsInt,
  IsOptional,
  IsString,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';

// La imagen se sube como archivo (form-data, campo `imagen`); el resto de
// campos llegan como texto en el mismo form-data.
export class CrearBannerHttpDto {
  @IsString()
  @MinLength(1, { message: 'El título es requerido' })
  @MaxLength(120, { message: 'El título admite como máximo 120 caracteres' })
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  titulo!: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  @Transform(({ value }) =>
    typeof value === 'string' ? value.trim() || null : value,
  )
  subtitulo?: string | null;

  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'orden debe ser un entero' })
  @Min(0, { message: 'orden no puede ser negativo' })
  orden?: number;

  @IsOptional()
  @Transform(({ value }) =>
    value === undefined ? undefined : value === 'true' || value === true,
  )
  @IsBoolean({ message: 'activo debe ser booleano' })
  activo?: boolean;
}

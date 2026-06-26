import { IsNumber, IsOptional, Min } from 'class-validator';

export class ActualizarMetaConfigHttpDto {
  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 }, { message: 'metaMensual debe ser numérico' })
  @Min(0, { message: 'metaMensual no puede ser negativa' })
  metaMensual?: number;

  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 }, { message: 'metaMinima debe ser numérica' })
  @Min(0, { message: 'metaMinima no puede ser negativa' })
  metaMinima?: number;

  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 }, { message: 'metaMaxima debe ser numérica' })
  @Min(0, { message: 'metaMaxima no puede ser negativa' })
  metaMaxima?: number;
}

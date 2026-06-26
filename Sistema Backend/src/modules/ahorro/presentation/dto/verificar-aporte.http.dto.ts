import { IsIn, IsOptional, IsString, MaxLength } from 'class-validator';
import type { EstadoAporte } from '@prisma/client';

// El admin no debe volver a marcar como "pendiente"; ese es el estado inicial.
const ESTADOS_VERIFICABLES: EstadoAporte[] = [
  'verificado',
  'incompleto',
  'atrasado',
  'rechazado',
];

export class VerificarAporteHttpDto {
  @IsIn(ESTADOS_VERIFICABLES, {
    message: `estado debe ser uno de: ${ESTADOS_VERIFICABLES.join(', ')}`,
  })
  estado!: EstadoAporte;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  observaciones?: string;
}

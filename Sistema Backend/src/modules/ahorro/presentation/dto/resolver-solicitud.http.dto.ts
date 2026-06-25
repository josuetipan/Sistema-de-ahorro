import { IsBoolean, IsOptional, IsString, MaxLength } from 'class-validator';

export class ResolverSolicitudHttpDto {
  @IsBoolean({ message: 'aprobar debe ser booleano' })
  aprobar!: boolean;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  observaciones?: string;
}

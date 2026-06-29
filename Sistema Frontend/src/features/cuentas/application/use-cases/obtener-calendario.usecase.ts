import type { ICuentaRepository } from '../../domain/cuenta.repository';
import type { CalendarioAhorro } from '../../domain/cuenta.entity';

export async function obtenerCalendarioUseCase(
  repository: ICuentaRepository,
  cuentaId: string,
  anio: number,
): Promise<CalendarioAhorro> {
  return repository.obtenerCalendario(cuentaId, anio);
}

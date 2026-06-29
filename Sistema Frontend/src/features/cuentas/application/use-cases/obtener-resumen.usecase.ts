import type { ICuentaRepository } from '../../domain/cuenta.repository';
import type { ResumenAhorroGlobal } from '../../domain/cuenta.entity';

export async function obtenerResumenAhorroUseCase(
  repository: ICuentaRepository,
): Promise<ResumenAhorroGlobal> {
  return repository.obtenerResumen();
}

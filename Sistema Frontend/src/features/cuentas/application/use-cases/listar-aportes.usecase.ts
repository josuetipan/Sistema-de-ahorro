import type { ICuentaRepository } from '../../domain/cuenta.repository';
import type { AportesPage, ListarAportesParams } from '../../domain/cuenta.entity';

export async function listarAportesUseCase(
  repository: ICuentaRepository,
  params: ListarAportesParams,
): Promise<AportesPage> {
  return repository.listarAportes(params);
}

import type { ICreditoRepository } from '../../domain/credito.repository';
import type { Credito } from '../../domain/credito.entity';

export async function consultarCreditosUseCase(repository: ICreditoRepository): Promise<Credito[]> {
  return repository.consultarTodos();
}

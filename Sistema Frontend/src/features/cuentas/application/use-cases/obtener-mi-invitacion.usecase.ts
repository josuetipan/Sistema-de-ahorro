import type { ICuentaRepository } from '../../domain/cuenta.repository';
import type { Invitacion } from '../../domain/cuenta.entity';

export async function obtenerMiInvitacionUseCase(
  repository: ICuentaRepository,
): Promise<Invitacion> {
  return repository.obtenerMiInvitacion();
}

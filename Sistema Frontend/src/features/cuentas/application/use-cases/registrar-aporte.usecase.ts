import type { ICuentaRepository } from '../../domain/cuenta.repository';
import type { Aporte, RegistrarAporteInput } from '../../domain/cuenta.entity';

export async function registrarAporteUseCase(
  repository: ICuentaRepository,
  input: RegistrarAporteInput,
): Promise<Aporte> {
  return repository.registrarAporte(input);
}

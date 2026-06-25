import type { ISocioRepository } from '../../domain/socio.repository';
import type { RegistroPublicoSocioInput, Socio } from '../../domain/socio.entity';

export async function registrarSocioPublicoUseCase(
  repository: ISocioRepository,
  input: RegistroPublicoSocioInput,
): Promise<Socio> {
  return repository.registrarPublico(input);
}

import type { ICuentaRepository } from '../../domain/cuenta.repository';
import type { CrearCuentaInput, CuentaCreada } from '../../domain/cuenta.entity';

export async function crearCuentaUseCase(
  repository: ICuentaRepository,
  input: CrearCuentaInput,
): Promise<CuentaCreada> {
  return repository.crearCuenta(input);
}

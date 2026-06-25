import type { UseCase } from "../../../../shared/application/use-case.interface";
import { type CrearCuentaInput, type CuentaRepositoryPort, type CuentaResumen } from '../../domain/ports/cuenta.repository.port';
export declare class CrearCuentaUseCase implements UseCase<CrearCuentaInput, CuentaResumen> {
    private readonly cuentas;
    constructor(cuentas: CuentaRepositoryPort);
    execute(input: CrearCuentaInput): Promise<CuentaResumen>;
}

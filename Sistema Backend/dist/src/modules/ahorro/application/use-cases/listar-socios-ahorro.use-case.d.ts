import type { UseCase } from "../../../../shared/application/use-case.interface";
import { type CuentaRepositoryPort, type SocioAhorroResumen } from '../../domain/ports/cuenta.repository.port';
export declare class ListarSociosAhorroUseCase implements UseCase<void, SocioAhorroResumen[]> {
    private readonly cuentas;
    constructor(cuentas: CuentaRepositoryPort);
    execute(): Promise<SocioAhorroResumen[]>;
}

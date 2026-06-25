import type { UseCase } from "../../../../shared/application/use-case.interface";
import { type CuentaRepositoryPort, type SocioAhorroResumen } from '../../domain/ports/cuenta.repository.port';
export declare class GetSocioAhorroUseCase implements UseCase<string, SocioAhorroResumen> {
    private readonly cuentas;
    constructor(cuentas: CuentaRepositoryPort);
    execute(socioId: string): Promise<SocioAhorroResumen>;
}

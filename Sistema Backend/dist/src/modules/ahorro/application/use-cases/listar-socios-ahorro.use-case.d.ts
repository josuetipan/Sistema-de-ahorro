import type { UseCase } from "../../../../shared/application/use-case.interface";
import { type PaginatedResult } from "../../../../shared/application/pagination";
import { type CuentaRepositoryPort, type SocioAhorroResumen } from '../../domain/ports/cuenta.repository.port';
export interface ListarSociosAhorroInput {
    page: number;
    limit: number;
}
export declare class ListarSociosAhorroUseCase implements UseCase<ListarSociosAhorroInput, PaginatedResult<SocioAhorroResumen>> {
    private readonly cuentas;
    constructor(cuentas: CuentaRepositoryPort);
    execute(input: ListarSociosAhorroInput): Promise<PaginatedResult<SocioAhorroResumen>>;
}

import type { UseCase } from "../../../../shared/application/use-case.interface";
import { type PaginatedResult } from "../../../../shared/application/pagination";
import { type CuentaRepositoryPort, type ListSociosCustomerParams, type SocioAhorroResumen } from '../../domain/ports/cuenta.repository.port';
export type ListarSociosAhorroInput = ListSociosCustomerParams;
export declare class ListarSociosAhorroUseCase implements UseCase<ListarSociosAhorroInput, PaginatedResult<SocioAhorroResumen>> {
    private readonly cuentas;
    constructor(cuentas: CuentaRepositoryPort);
    execute(input: ListarSociosAhorroInput): Promise<PaginatedResult<SocioAhorroResumen>>;
}

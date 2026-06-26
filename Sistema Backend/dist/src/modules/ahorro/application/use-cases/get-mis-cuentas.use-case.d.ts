import type { UseCase } from "../../../../shared/application/use-case.interface";
import { type CuentaRepositoryPort, type CuentaResumen } from '../../domain/ports/cuenta.repository.port';
export interface MisCuentasResult {
    totalAhorradoGlobal: number;
    cantidadCuentas: number;
    cuentas: CuentaResumen[];
}
export declare class GetMisCuentasUseCase implements UseCase<string, MisCuentasResult> {
    private readonly cuentas;
    constructor(cuentas: CuentaRepositoryPort);
    execute(userId: string): Promise<MisCuentasResult>;
}

import type { UseCase } from "../../../../shared/application/use-case.interface";
import { type CuentaRepositoryPort, type CuentaResumen } from '../../domain/ports/cuenta.repository.port';
export interface CrearMiCuentaInput {
    userId: string;
    nombre: string;
    tipo?: string;
    moneda?: string;
    color?: string | null;
    icono?: string | null;
}
export interface CrearMiCuentaResult {
    socioId: string;
    cuenta: CuentaResumen;
}
export declare class CrearMiCuentaUseCase implements UseCase<CrearMiCuentaInput, CrearMiCuentaResult> {
    private readonly cuentas;
    constructor(cuentas: CuentaRepositoryPort);
    execute(input: CrearMiCuentaInput): Promise<CrearMiCuentaResult>;
}

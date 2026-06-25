import type { TipoSolicitudCuenta } from '@prisma/client';
import type { UseCase } from "../../../../shared/application/use-case.interface";
import { type CuentaRepositoryPort } from '../../domain/ports/cuenta.repository.port';
import { type SolicitudCuentaRepositoryPort, type SolicitudCuentaResumen } from '../../domain/ports/solicitud-cuenta.repository.port';
export interface CrearSolicitudCuentaInput {
    userId: string;
    cuentaOrigenId: string;
    tipo: TipoSolicitudCuenta;
    monto?: number | null;
    cuentaDestinoId?: string | null;
    motivo?: string | null;
}
export declare class CrearSolicitudCuentaUseCase implements UseCase<CrearSolicitudCuentaInput, SolicitudCuentaResumen> {
    private readonly cuentas;
    private readonly solicitudes;
    constructor(cuentas: CuentaRepositoryPort, solicitudes: SolicitudCuentaRepositoryPort);
    execute(input: CrearSolicitudCuentaInput): Promise<SolicitudCuentaResumen>;
}

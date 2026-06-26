import type { TipoSolicitudCuenta } from '@prisma/client';
export declare class CrearSolicitudHttpDto {
    tipo: TipoSolicitudCuenta;
    monto?: number;
    cuentaDestinoId?: string;
    motivo?: string;
}

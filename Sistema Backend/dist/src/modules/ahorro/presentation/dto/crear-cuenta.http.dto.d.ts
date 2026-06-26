import type { TipoCuenta } from '@prisma/client';
export declare class CrearCuentaHttpDto {
    nombre: string;
    tipo?: TipoCuenta;
    moneda?: string;
    color?: string;
    icono?: string;
}

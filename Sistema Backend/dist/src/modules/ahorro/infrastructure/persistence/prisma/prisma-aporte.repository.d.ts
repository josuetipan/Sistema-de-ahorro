import type { EstadoAporte } from '@prisma/client';
import { PrismaService } from "../../../../../shared/infrastructure/prisma/prisma.service";
import type { AporteAdminItem, AporteRepositoryPort, AporteResumen, CrearAporteInput, ListarAportesFiltro } from '../../../domain/ports/aporte.repository.port';
export declare class PrismaAporteRepository implements AporteRepositoryPort {
    private readonly prisma;
    constructor(prisma: PrismaService);
    existsByCuentaAndMes(cuentaId: string, mes: string): Promise<boolean>;
    existsByComprobante(comprobante: string): Promise<boolean>;
    create(input: CrearAporteInput): Promise<AporteResumen>;
    findById(aporteId: string): Promise<AporteResumen | null>;
    listByCuentaAndAnio(cuentaId: string, anio: number): Promise<AporteResumen[]>;
    listForAdmin(filtro: ListarAportesFiltro): Promise<AporteAdminItem[]>;
    cambiarEstado(aporteId: string, estado: EstadoAporte, observaciones?: string | null, verificadoPor?: string | null): Promise<AporteResumen>;
}

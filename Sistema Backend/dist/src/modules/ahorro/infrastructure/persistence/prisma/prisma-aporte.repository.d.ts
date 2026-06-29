import type { EstadoAporte } from '@prisma/client';
import { PrismaService } from "../../../../../shared/infrastructure/prisma/prisma.service";
import type { PageSlice } from "../../../../../shared/application/pagination";
import type { AporteAdminItem, AporteAgregadoCuenta, AporteComprobante, AporteListItem, AporteRepositoryPort, AporteResumen, CrearAporteInput, ListarAportesFiltro, ListarMisAportesFiltro } from '../../../domain/ports/aporte.repository.port';
export declare class PrismaAporteRepository implements AporteRepositoryPort {
    private readonly prisma;
    constructor(prisma: PrismaService);
    existsByCuentaAndMes(cuentaId: string, mes: string): Promise<boolean>;
    existsByComprobante(comprobante: string): Promise<boolean>;
    create(input: CrearAporteInput): Promise<AporteResumen>;
    findById(aporteId: string): Promise<AporteResumen | null>;
    findComprobante(aporteId: string): Promise<AporteComprobante | null>;
    listByCuentaAndAnio(cuentaId: string, anio: number): Promise<AporteListItem[]>;
    listByUserId(userId: string, filtro: ListarMisAportesFiltro): Promise<PageSlice<AporteListItem>>;
    listAggregatesByUser(userId: string, mes: string): Promise<AporteAgregadoCuenta[]>;
    listForAdmin(filtro: ListarAportesFiltro): Promise<PageSlice<AporteAdminItem>>;
    cambiarEstado(aporteId: string, estado: EstadoAporte, observaciones?: string | null, verificadoPor?: string | null): Promise<AporteResumen>;
}

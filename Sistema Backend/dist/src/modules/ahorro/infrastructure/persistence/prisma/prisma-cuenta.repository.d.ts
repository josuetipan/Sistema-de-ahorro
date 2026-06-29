import { PrismaService } from "../../../../../shared/infrastructure/prisma/prisma.service";
import type { PageSlice } from "../../../../../shared/application/pagination";
import type { CrearCuentaInput, CuentaOwnership, CuentaRepositoryPort, CuentaResumen, SocioAhorroResumen } from '../../../domain/ports/cuenta.repository.port';
export declare class PrismaCuentaRepository implements CuentaRepositoryPort {
    private readonly prisma;
    constructor(prisma: PrismaService);
    socioExists(socioId: string): Promise<boolean>;
    create(input: CrearCuentaInput): Promise<CuentaResumen>;
    listByUserId(userId: string): Promise<CuentaResumen[]>;
    findSocioIdByUserId(userId: string): Promise<string | null>;
    findOwnership(cuentaId: string): Promise<CuentaOwnership | null>;
    findResumenById(cuentaId: string): Promise<CuentaResumen | null>;
    listSociosCustomer(params: {
        page: number;
        limit: number;
    }): Promise<PageSlice<SocioAhorroResumen>>;
    getSocioCustomer(socioId: string): Promise<SocioAhorroResumen | null>;
}

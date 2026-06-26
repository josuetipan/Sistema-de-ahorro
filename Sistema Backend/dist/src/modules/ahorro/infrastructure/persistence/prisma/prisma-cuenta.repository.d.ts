import { PrismaService } from "../../../../../shared/infrastructure/prisma/prisma.service";
import type { CrearCuentaInput, CuentaOwnership, CuentaRepositoryPort, CuentaResumen, SocioAhorroResumen } from '../../../domain/ports/cuenta.repository.port';
export declare class PrismaCuentaRepository implements CuentaRepositoryPort {
    private readonly prisma;
    constructor(prisma: PrismaService);
    socioExists(socioId: string): Promise<boolean>;
    create(input: CrearCuentaInput): Promise<CuentaResumen>;
    listByUserId(userId: string): Promise<CuentaResumen[]>;
    findOwnership(cuentaId: string): Promise<CuentaOwnership | null>;
    findResumenById(cuentaId: string): Promise<CuentaResumen | null>;
    listSociosCustomer(): Promise<SocioAhorroResumen[]>;
    getSocioCustomer(socioId: string): Promise<SocioAhorroResumen | null>;
}

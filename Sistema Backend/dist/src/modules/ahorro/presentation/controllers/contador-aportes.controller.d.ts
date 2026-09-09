import { type AuthUserPayload } from '../../../auth/infrastructure/auth/current-user.decorator';
import { ListarAportesUseCase } from '../../application/use-cases/listar-aportes.use-case';
import { VerificarAporteUseCase } from '../../application/use-cases/verificar-aporte.use-case';
import { VerificarAporteHttpDto } from '../dto/verificar-aporte.http.dto';
import { GetComprobanteAporteAdminUseCase } from '../../application/use-cases/get-comprobante-aporte-admin.use-case';
import type { EstadoAporte } from '@prisma/client';
export declare class ContadorAportesController {
    private readonly listarAportes;
    private readonly verificarAporte;
    private readonly getComprobanteAporte;
    constructor(listarAportes: ListarAportesUseCase, verificarAporte: VerificarAporteUseCase, getComprobanteAporte: GetComprobanteAporteAdminUseCase);
    list(estado?: EstadoAporte, page?: string, limit?: string): Promise<import("../../../../shared/application/pagination").PaginatedResult<import("../../domain/ports/aporte.repository.port").AporteAdminItem>>;
    comprobante(aporteId: string): Promise<import("../../domain/ports/aporte.repository.port").AporteComprobante>;
    verify(user: AuthUserPayload, aporteId: string, body: VerificarAporteHttpDto): Promise<import("../../domain/ports/aporte.repository.port").AporteResumen>;
}

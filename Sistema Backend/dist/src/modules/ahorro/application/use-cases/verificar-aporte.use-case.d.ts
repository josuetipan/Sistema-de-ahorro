import type { EstadoAporte } from '@prisma/client';
import type { UseCase } from "../../../../shared/application/use-case.interface";
import { type AporteRepositoryPort, type AporteResumen } from '../../domain/ports/aporte.repository.port';
export interface VerificarAporteInput {
    aporteId: string;
    estado: EstadoAporte;
    observaciones?: string | null;
    verificadoPor: string;
}
export declare class VerificarAporteUseCase implements UseCase<VerificarAporteInput, AporteResumen> {
    private readonly aportes;
    constructor(aportes: AporteRepositoryPort);
    execute(input: VerificarAporteInput): Promise<AporteResumen>;
}

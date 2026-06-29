import type { UseCase } from "../../../../shared/application/use-case.interface";
import { type ActualizarBannerInput, type BannerRepositoryPort, type BannerResumen } from '../../domain/ports/banner.repository.port';
export interface ActualizarBannerUseCaseInput extends ActualizarBannerInput {
    bannerId: string;
}
export declare class ActualizarBannerUseCase implements UseCase<ActualizarBannerUseCaseInput, BannerResumen> {
    private readonly banners;
    constructor(banners: BannerRepositoryPort);
    execute(input: ActualizarBannerUseCaseInput): Promise<BannerResumen>;
}

import type { UseCase } from "../../../../shared/application/use-case.interface";
import { type BannerRepositoryPort, type BannerResumen, type CrearBannerInput } from '../../domain/ports/banner.repository.port';
export declare class CrearBannerUseCase implements UseCase<CrearBannerInput, BannerResumen> {
    private readonly banners;
    constructor(banners: BannerRepositoryPort);
    execute(input: CrearBannerInput): Promise<BannerResumen>;
}

import type { UseCase } from "../../../../shared/application/use-case.interface";
import { type BannerRepositoryPort } from '../../domain/ports/banner.repository.port';
export declare class EliminarBannerUseCase implements UseCase<string, void> {
    private readonly banners;
    constructor(banners: BannerRepositoryPort);
    execute(bannerId: string): Promise<void>;
}

import type { UseCase } from "../../../../shared/application/use-case.interface";
import { type BannerRepositoryPort, type BannerResumen } from '../../domain/ports/banner.repository.port';
export declare class ListarBannersUseCase implements UseCase<void, BannerResumen[]> {
    private readonly banners;
    constructor(banners: BannerRepositoryPort);
    execute(): Promise<BannerResumen[]>;
}

import { PrismaService } from "../../../../../shared/infrastructure/prisma/prisma.service";
import type { ActualizarBannerInput, BannerRepositoryPort, BannerResumen, CrearBannerInput } from '../../../domain/ports/banner.repository.port';
export declare class PrismaBannerRepository implements BannerRepositoryPort {
    private readonly prisma;
    constructor(prisma: PrismaService);
    listActive(): Promise<BannerResumen[]>;
    listAll(): Promise<BannerResumen[]>;
    create(input: CrearBannerInput): Promise<BannerResumen>;
    findById(bannerId: string): Promise<BannerResumen | null>;
    update(bannerId: string, input: ActualizarBannerInput): Promise<BannerResumen>;
    delete(bannerId: string): Promise<void>;
}

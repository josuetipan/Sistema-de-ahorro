import type { UseCase } from "../../../../shared/application/use-case.interface";
import { type MetaConfig, type MetaConfigRepositoryPort } from '../../domain/ports/meta-config.repository.port';
export declare class GetMetaConfigUseCase implements UseCase<void, MetaConfig> {
    private readonly metaConfig;
    constructor(metaConfig: MetaConfigRepositoryPort);
    execute(): Promise<MetaConfig>;
}

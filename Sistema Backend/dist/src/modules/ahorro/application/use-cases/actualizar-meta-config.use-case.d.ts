import type { UseCase } from "../../../../shared/application/use-case.interface";
import { type ActualizarMetaConfigInput, type MetaConfig, type MetaConfigRepositoryPort } from '../../domain/ports/meta-config.repository.port';
export declare class ActualizarMetaConfigUseCase implements UseCase<ActualizarMetaConfigInput, MetaConfig> {
    private readonly metaConfig;
    constructor(metaConfig: MetaConfigRepositoryPort);
    execute(input: ActualizarMetaConfigInput): Promise<MetaConfig>;
}

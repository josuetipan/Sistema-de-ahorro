import { Inject, Injectable } from '@nestjs/common';
import type { UseCase } from '@shared/application/use-case.interface';
import {
  META_CONFIG_REPOSITORY,
  type MetaConfig,
  type MetaConfigRepositoryPort,
} from '../../domain/ports/meta-config.repository.port';

@Injectable()
export class GetMetaConfigUseCase implements UseCase<void, MetaConfig> {
  constructor(
    @Inject(META_CONFIG_REPOSITORY)
    private readonly metaConfig: MetaConfigRepositoryPort,
  ) {}

  async execute(): Promise<MetaConfig> {
    return this.metaConfig.getOrCreate();
  }
}

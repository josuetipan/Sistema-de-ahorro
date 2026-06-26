import { Inject, Injectable } from '@nestjs/common';
import type { UseCase } from '@shared/application/use-case.interface';
import { MetaConfigInvalidaError } from '../../domain/ahorro.errors';
import {
  META_CONFIG_REPOSITORY,
  type ActualizarMetaConfigInput,
  type MetaConfig,
  type MetaConfigRepositoryPort,
} from '../../domain/ports/meta-config.repository.port';

@Injectable()
export class ActualizarMetaConfigUseCase
  implements UseCase<ActualizarMetaConfigInput, MetaConfig>
{
  constructor(
    @Inject(META_CONFIG_REPOSITORY)
    private readonly metaConfig: MetaConfigRepositoryPort,
  ) {}

  async execute(input: ActualizarMetaConfigInput): Promise<MetaConfig> {
    const actual = await this.metaConfig.getOrCreate();
    const minima = input.metaMinima ?? actual.metaMinima;
    const maxima = input.metaMaxima ?? actual.metaMaxima;
    if (maxima > 0 && minima > maxima) {
      throw new MetaConfigInvalidaError();
    }
    return this.metaConfig.actualizar(input);
  }
}

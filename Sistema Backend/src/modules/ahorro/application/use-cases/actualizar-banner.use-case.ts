import { Inject, Injectable } from '@nestjs/common';
import type { UseCase } from '@shared/application/use-case.interface';
import { BannerNotFoundError } from '../../domain/ahorro.errors';
import {
  BANNER_REPOSITORY,
  type ActualizarBannerInput,
  type BannerRepositoryPort,
  type BannerResumen,
} from '../../domain/ports/banner.repository.port';

export interface ActualizarBannerUseCaseInput extends ActualizarBannerInput {
  bannerId: string;
}

@Injectable()
export class ActualizarBannerUseCase
  implements UseCase<ActualizarBannerUseCaseInput, BannerResumen>
{
  constructor(
    @Inject(BANNER_REPOSITORY)
    private readonly banners: BannerRepositoryPort,
  ) {}

  async execute(input: ActualizarBannerUseCaseInput): Promise<BannerResumen> {
    const { bannerId, ...cambios } = input;
    const existente = await this.banners.findById(bannerId);
    if (!existente) {
      throw new BannerNotFoundError(bannerId);
    }
    return this.banners.update(bannerId, cambios);
  }
}

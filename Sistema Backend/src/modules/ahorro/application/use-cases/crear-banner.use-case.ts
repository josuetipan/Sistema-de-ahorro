import { Inject, Injectable } from '@nestjs/common';
import type { UseCase } from '@shared/application/use-case.interface';
import {
  BANNER_REPOSITORY,
  type BannerRepositoryPort,
  type BannerResumen,
  type CrearBannerInput,
} from '../../domain/ports/banner.repository.port';

@Injectable()
export class CrearBannerUseCase
  implements UseCase<CrearBannerInput, BannerResumen>
{
  constructor(
    @Inject(BANNER_REPOSITORY)
    private readonly banners: BannerRepositoryPort,
  ) {}

  async execute(input: CrearBannerInput): Promise<BannerResumen> {
    return this.banners.create(input);
  }
}

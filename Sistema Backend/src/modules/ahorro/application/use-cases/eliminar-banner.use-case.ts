import { Inject, Injectable } from '@nestjs/common';
import type { UseCase } from '@shared/application/use-case.interface';
import { BannerNotFoundError } from '../../domain/ahorro.errors';
import {
  BANNER_REPOSITORY,
  type BannerRepositoryPort,
} from '../../domain/ports/banner.repository.port';

@Injectable()
export class EliminarBannerUseCase implements UseCase<string, void> {
  constructor(
    @Inject(BANNER_REPOSITORY)
    private readonly banners: BannerRepositoryPort,
  ) {}

  async execute(bannerId: string): Promise<void> {
    const existente = await this.banners.findById(bannerId);
    if (!existente) {
      throw new BannerNotFoundError(bannerId);
    }
    await this.banners.delete(bannerId);
  }
}

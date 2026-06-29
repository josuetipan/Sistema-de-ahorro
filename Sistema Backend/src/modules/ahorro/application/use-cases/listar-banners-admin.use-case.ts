import { Inject, Injectable } from '@nestjs/common';
import type { UseCase } from '@shared/application/use-case.interface';
import {
  BANNER_REPOSITORY,
  type BannerRepositoryPort,
  type BannerResumen,
} from '../../domain/ports/banner.repository.port';

@Injectable()
export class ListarBannersAdminUseCase
  implements UseCase<void, BannerResumen[]>
{
  constructor(
    @Inject(BANNER_REPOSITORY)
    private readonly banners: BannerRepositoryPort,
  ) {}

  async execute(): Promise<BannerResumen[]> {
    return this.banners.listAll();
  }
}

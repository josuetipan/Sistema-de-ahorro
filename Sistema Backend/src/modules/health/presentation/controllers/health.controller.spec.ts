import { Test, TestingModule } from '@nestjs/testing';
import { GetHealthUseCase } from '../../application/use-cases/get-health.use-case';
import { HEALTH_REPOSITORY } from '../../domain/ports/health.repository.port';
import { HealthController } from './health.controller';

describe('HealthController', () => {
  let controller: HealthController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HealthController],
      providers: [
        GetHealthUseCase,
        {
          provide: HEALTH_REPOSITORY,
          useValue: { pingDatabase: jest.fn().mockResolvedValue(true) },
        },
      ],
    }).compile();

    controller = module.get(HealthController);
  });

  it('devuelve estado de salud', async () => {
    const result = await controller.health();
    expect(result.service).toBe('finnova-api');
    expect(result.database).toBe('ok');
  });
});

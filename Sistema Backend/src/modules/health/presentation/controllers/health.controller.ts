import { Controller, Get } from '@nestjs/common';
import { GetHealthUseCase } from '../../application/use-cases/get-health.use-case';

@Controller('health')
export class HealthController {
  constructor(private readonly getHealthUseCase: GetHealthUseCase) {}

  @Get()
  health() {
    return this.getHealthUseCase.execute();
  }
}

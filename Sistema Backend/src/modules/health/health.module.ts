import { Module } from '@nestjs/common';
import { GetHealthUseCase } from './application/use-cases/get-health.use-case';
import { HEALTH_REPOSITORY } from './domain/ports/health.repository.port';
import { PrismaHealthRepository } from './infrastructure/persistence/prisma-health.repository';
import { HealthController } from './presentation/controllers/health.controller';

/**
 * Plantilla hexagonal por módulo:
 *
 * presentation/  → controllers + DTOs (HTTP)
 * application/   → use-cases (orquestación)
 * domain/        → entities + ports (interfaces)
 * infrastructure/→ adapters (Prisma, JWT, S3, etc.)
 *
 * Para un nuevo módulo (auth, aportes, cuentas…):
 * 1. Copia esta carpeta modules/health
 * 2. Renombra entidades, ports, use-cases y repository
 * 3. Registra el módulo en app.module.ts
 */
@Module({
  controllers: [HealthController],
  providers: [
    GetHealthUseCase,
    {
      provide: HEALTH_REPOSITORY,
      useClass: PrismaHealthRepository,
    },
  ],
})
export class HealthModule {}

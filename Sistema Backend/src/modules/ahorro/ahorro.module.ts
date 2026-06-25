import { Module } from '@nestjs/common';
import { AuthModule } from '@modules/auth/auth.module';
import { CUENTA_REPOSITORY } from './domain/ports/cuenta.repository.port';
import { APORTE_REPOSITORY } from './domain/ports/aporte.repository.port';
import { SOLICITUD_CUENTA_REPOSITORY } from './domain/ports/solicitud-cuenta.repository.port';
import { META_CONFIG_REPOSITORY } from './domain/ports/meta-config.repository.port';
import { PrismaCuentaRepository } from './infrastructure/persistence/prisma/prisma-cuenta.repository';
import { PrismaAporteRepository } from './infrastructure/persistence/prisma/prisma-aporte.repository';
import { PrismaSolicitudCuentaRepository } from './infrastructure/persistence/prisma/prisma-solicitud-cuenta.repository';
import { PrismaMetaConfigRepository } from './infrastructure/persistence/prisma/prisma-meta-config.repository';
import { GetMisCuentasUseCase } from './application/use-cases/get-mis-cuentas.use-case';
import { GetCalendarioCuentaUseCase } from './application/use-cases/get-calendario-cuenta.use-case';
import { RegistrarAporteUseCase } from './application/use-cases/registrar-aporte.use-case';
import { CrearSolicitudCuentaUseCase } from './application/use-cases/crear-solicitud-cuenta.use-case';
import { ListarMisSolicitudesUseCase } from './application/use-cases/listar-mis-solicitudes.use-case';
import { CrearCuentaUseCase } from './application/use-cases/crear-cuenta.use-case';
import { ListarAportesUseCase } from './application/use-cases/listar-aportes.use-case';
import { VerificarAporteUseCase } from './application/use-cases/verificar-aporte.use-case';
import { GetMetaConfigUseCase } from './application/use-cases/get-meta-config.use-case';
import { ActualizarMetaConfigUseCase } from './application/use-cases/actualizar-meta-config.use-case';
import { ListarSociosAhorroUseCase } from './application/use-cases/listar-socios-ahorro.use-case';
import { GetSocioAhorroUseCase } from './application/use-cases/get-socio-ahorro.use-case';
import { ListarSolicitudesUseCase } from './application/use-cases/listar-solicitudes.use-case';
import { ResolverSolicitudUseCase } from './application/use-cases/resolver-solicitud.use-case';
import { AhorroController } from './presentation/controllers/ahorro.controller';
import { AdminAhorroController } from './presentation/controllers/admin-ahorro.controller';

@Module({
  imports: [AuthModule],
  controllers: [AhorroController, AdminAhorroController],
  providers: [
    PrismaCuentaRepository,
    PrismaAporteRepository,
    PrismaSolicitudCuentaRepository,
    PrismaMetaConfigRepository,
    { provide: CUENTA_REPOSITORY, useExisting: PrismaCuentaRepository },
    { provide: APORTE_REPOSITORY, useExisting: PrismaAporteRepository },
    {
      provide: SOLICITUD_CUENTA_REPOSITORY,
      useExisting: PrismaSolicitudCuentaRepository,
    },
    { provide: META_CONFIG_REPOSITORY, useExisting: PrismaMetaConfigRepository },
    GetMisCuentasUseCase,
    GetCalendarioCuentaUseCase,
    RegistrarAporteUseCase,
    CrearSolicitudCuentaUseCase,
    ListarMisSolicitudesUseCase,
    CrearCuentaUseCase,
    ListarAportesUseCase,
    VerificarAporteUseCase,
    GetMetaConfigUseCase,
    ActualizarMetaConfigUseCase,
    ListarSociosAhorroUseCase,
    GetSocioAhorroUseCase,
    ListarSolicitudesUseCase,
    ResolverSolicitudUseCase,
  ],
})
export class AhorroModule {}

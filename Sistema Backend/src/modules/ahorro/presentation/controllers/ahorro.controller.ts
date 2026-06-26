import {
  BadRequestException,
  Body,
  Controller,
  ForbiddenException,
  Get,
  HttpCode,
  InternalServerErrorException,
  Logger,
  NotFoundException,
  Param,
  ParseUUIDPipe,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UserRole } from '../../../auth/domain/user-role';
import { Roles } from '../../../auth/infrastructure/auth/roles.decorator';
import { RolesGuard } from '../../../auth/infrastructure/auth/roles.guard';
import {
  CurrentUser,
  type AuthUserPayload,
} from '../../../auth/infrastructure/auth/current-user.decorator';
import {
  AporteMesAlreadyExistsError,
  ComprobanteAlreadyTakenError,
  CuentaForbiddenError,
  CuentaNotFoundError,
  SaldoInsuficienteError,
} from '../../domain/ahorro.errors';
import { GetMisCuentasUseCase } from '../../application/use-cases/get-mis-cuentas.use-case';
import { GetMetaConfigUseCase } from '../../application/use-cases/get-meta-config.use-case';
import { GetCalendarioCuentaUseCase } from '../../application/use-cases/get-calendario-cuenta.use-case';
import { RegistrarAporteUseCase } from '../../application/use-cases/registrar-aporte.use-case';
import { CrearSolicitudCuentaUseCase } from '../../application/use-cases/crear-solicitud-cuenta.use-case';
import { ListarMisSolicitudesUseCase } from '../../application/use-cases/listar-mis-solicitudes.use-case';
import { RegistrarAporteHttpDto } from '../dto/registrar-aporte.http.dto';
import { CrearSolicitudHttpDto } from '../dto/crear-solicitud.http.dto';

@Controller('ahorro')
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Roles(UserRole.CUSTOMER)
export class AhorroController {
  private readonly logger = new Logger(AhorroController.name);

  constructor(
    private readonly getMisCuentas: GetMisCuentasUseCase,
    private readonly getMetaConfig: GetMetaConfigUseCase,
    private readonly getCalendario: GetCalendarioCuentaUseCase,
    private readonly registrarAporte: RegistrarAporteUseCase,
    private readonly crearSolicitud: CrearSolicitudCuentaUseCase,
    private readonly listarMisSolicitudes: ListarMisSolicitudesUseCase,
  ) {}

  @Get('mis-cuentas')
  async misCuentas(@CurrentUser() user: AuthUserPayload) {
    return this.getMisCuentas.execute(user.id);
  }

  @Get('meta')
  async meta() {
    return this.getMetaConfig.execute();
  }

  @Get('cuentas/:cuentaId/calendario')
  async calendario(
    @CurrentUser() user: AuthUserPayload,
    @Param('cuentaId', ParseUUIDPipe) cuentaId: string,
    @Query('anio') anio?: string,
  ) {
    const year = anio ? Number(anio) : new Date().getFullYear();
    if (!Number.isInteger(year) || year < 2000 || year > 2100) {
      throw new BadRequestException('anio inválido');
    }
    try {
      return await this.getCalendario.execute({
        userId: user.id,
        cuentaId,
        anio: year,
      });
    } catch (err) {
      throw this.mapError(err);
    }
  }

  @Post('cuentas/:cuentaId/aportes')
  @HttpCode(201)
  async registrarAportePago(
    @CurrentUser() user: AuthUserPayload,
    @Param('cuentaId', ParseUUIDPipe) cuentaId: string,
    @Body() body: RegistrarAporteHttpDto,
  ) {
    try {
      return await this.registrarAporte.execute({
        userId: user.id,
        cuentaId,
        mes: body.mes,
        monto: body.monto,
        comprobante: body.comprobante,
        urlArchivo: body.urlArchivo,
        referencia: body.referencia ?? null,
        archivoNombre: body.archivoNombre ?? null,
        descripcion: body.descripcion ?? null,
      });
    } catch (err) {
      throw this.mapError(err);
    }
  }

  @Post('cuentas/:cuentaId/solicitudes')
  @HttpCode(201)
  async solicitar(
    @CurrentUser() user: AuthUserPayload,
    @Param('cuentaId', ParseUUIDPipe) cuentaId: string,
    @Body() body: CrearSolicitudHttpDto,
  ) {
    try {
      return await this.crearSolicitud.execute({
        userId: user.id,
        cuentaOrigenId: cuentaId,
        tipo: body.tipo,
        monto: body.monto ?? null,
        cuentaDestinoId: body.cuentaDestinoId ?? null,
        motivo: body.motivo ?? null,
      });
    } catch (err) {
      throw this.mapError(err);
    }
  }

  @Get('mis-solicitudes')
  async misSolicitudes(@CurrentUser() user: AuthUserPayload) {
    return this.listarMisSolicitudes.execute(user.id);
  }

  private mapError(err: unknown): Error {
    if (err instanceof CuentaNotFoundError) {
      return new NotFoundException(err.message);
    }
    if (err instanceof CuentaForbiddenError) {
      return new ForbiddenException(err.message);
    }
    if (
      err instanceof AporteMesAlreadyExistsError ||
      err instanceof ComprobanteAlreadyTakenError
    ) {
      return new BadRequestException(err.message);
    }
    if (err instanceof SaldoInsuficienteError) {
      return new BadRequestException(err.message);
    }
    this.logger.error(
      'Error no controlado en AhorroController',
      err instanceof Error ? err.stack : String(err),
    );
    return new InternalServerErrorException();
  }
}

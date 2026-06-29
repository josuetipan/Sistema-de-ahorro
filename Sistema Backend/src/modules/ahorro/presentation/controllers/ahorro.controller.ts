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
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthGuard } from '@nestjs/passport';
import {
  COMPROBANTE_MIME_TYPES,
  MAX_UPLOAD_BYTES,
  assertAllowedMime,
  toBase64DataUri,
  type UploadedFileLike,
} from '@shared/presentation/uploaded-file';
import { UserRole } from '../../../auth/domain/user-role';
import { Roles } from '../../../auth/infrastructure/auth/roles.decorator';
import { RolesGuard } from '../../../auth/infrastructure/auth/roles.guard';
import {
  CurrentUser,
  type AuthUserPayload,
} from '../../../auth/infrastructure/auth/current-user.decorator';
import {
  AporteMesAlreadyExistsError,
  AporteNotFoundError,
  ComprobanteAlreadyTakenError,
  CuentaForbiddenError,
  CuentaNotFoundError,
  InvitacionNotFoundError,
  SaldoInsuficienteError,
  SocioNotFoundError,
} from '../../domain/ahorro.errors';
import { GetMisCuentasUseCase } from '../../application/use-cases/get-mis-cuentas.use-case';
import { GetMetaConfigUseCase } from '../../application/use-cases/get-meta-config.use-case';
import { GetCalendarioCuentaUseCase } from '../../application/use-cases/get-calendario-cuenta.use-case';
import { RegistrarAporteUseCase } from '../../application/use-cases/registrar-aporte.use-case';
import { CrearSolicitudCuentaUseCase } from '../../application/use-cases/crear-solicitud-cuenta.use-case';
import { ListarMisSolicitudesUseCase } from '../../application/use-cases/listar-mis-solicitudes.use-case';
import { ListarMisAportesUseCase } from '../../application/use-cases/listar-mis-aportes.use-case';
import { GetComprobanteAporteUseCase } from '../../application/use-cases/get-comprobante-aporte.use-case';
import { GetResumenAhorroUseCase } from '../../application/use-cases/get-resumen-ahorro.use-case';
import { GetMiInvitacionUseCase } from '../../application/use-cases/get-mi-invitacion.use-case';
import { ListarBannersUseCase } from '../../application/use-cases/listar-banners.use-case';
import { CrearMiCuentaUseCase } from '../../application/use-cases/crear-mi-cuenta.use-case';
import { parsePagination } from '@shared/presentation/parse-pagination';
import { RegistrarAporteHttpDto } from '../dto/registrar-aporte.http.dto';
import { CrearSolicitudHttpDto } from '../dto/crear-solicitud.http.dto';
import { CrearCuentaHttpDto } from '../dto/crear-cuenta.http.dto';

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
    private readonly listarMisAportes: ListarMisAportesUseCase,
    private readonly getComprobanteAporte: GetComprobanteAporteUseCase,
    private readonly getResumen: GetResumenAhorroUseCase,
    private readonly getMiInvitacion: GetMiInvitacionUseCase,
    private readonly listarBanners: ListarBannersUseCase,
    private readonly crearMiCuenta: CrearMiCuentaUseCase,
  ) {}

  @Get('mis-cuentas')
  async misCuentas(@CurrentUser() user: AuthUserPayload) {
    return this.getMisCuentas.execute(user.id);
  }

  @Get('resumen')
  async resumen(@CurrentUser() user: AuthUserPayload) {
    return this.getResumen.execute(user.id);
  }

  @Get('meta')
  async meta() {
    return this.getMetaConfig.execute();
  }

  @Get('banners')
  async banners() {
    return this.listarBanners.execute();
  }

  @Get('mi-invitacion')
  async miInvitacion(@CurrentUser() user: AuthUserPayload) {
    try {
      return await this.getMiInvitacion.execute(user.id);
    } catch (err) {
      throw this.mapError(err);
    }
  }

  @Post('cuentas')
  @HttpCode(201)
  async crearCuenta(
    @CurrentUser() user: AuthUserPayload,
    @Body() body: CrearCuentaHttpDto,
  ) {
    try {
      const { socioId, cuenta } = await this.crearMiCuenta.execute({
        userId: user.id,
        nombre: body.nombre,
        tipo: body.tipo,
        moneda: body.moneda,
        color: body.color ?? null,
        icono: body.icono ?? null,
      });
      return {
        ...cuenta,
        socioId,
        titular: user.fullName,
      };
    } catch (err) {
      throw this.mapError(err);
    }
  }

  @Get('aportes')
  async aportes(
    @CurrentUser() user: AuthUserPayload,
    @Query('cuentaId') cuentaId?: string,
    @Query('desde') desde?: string,
    @Query('hasta') hasta?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    const desdeDate = this.parseFecha(desde, 'desde');
    const hastaDate = this.parseFecha(hasta, 'hasta', true);
    const pagination = parsePagination(page, limit);
    try {
      return await this.listarMisAportes.execute({
        userId: user.id,
        cuentaId,
        desde: desdeDate,
        hasta: hastaDate,
        page: pagination.page,
        limit: pagination.limit,
      });
    } catch (err) {
      throw this.mapError(err);
    }
  }

  @Get('aportes/:aporteId/comprobante')
  async comprobanteAporte(
    @CurrentUser() user: AuthUserPayload,
    @Param('aporteId', ParseUUIDPipe) aporteId: string,
  ) {
    try {
      return await this.getComprobanteAporte.execute({
        userId: user.id,
        aporteId,
      });
    } catch (err) {
      throw this.mapError(err);
    }
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
  @UseInterceptors(
    FileInterceptor('archivo', { limits: { fileSize: MAX_UPLOAD_BYTES } }),
  )
  async registrarAportePago(
    @CurrentUser() user: AuthUserPayload,
    @Param('cuentaId', ParseUUIDPipe) cuentaId: string,
    @UploadedFile() archivo: UploadedFileLike | undefined,
    @Body() body: RegistrarAporteHttpDto,
  ) {
    if (!archivo) {
      throw new BadRequestException(
        'El comprobante (campo archivo) es requerido',
      );
    }
    assertAllowedMime(archivo, COMPROBANTE_MIME_TYPES);
    try {
      return await this.registrarAporte.execute({
        userId: user.id,
        cuentaId,
        mes: body.mes,
        monto: body.monto,
        comprobante: body.comprobante,
        urlArchivo: toBase64DataUri(archivo),
        referencia: body.referencia ?? null,
        archivoNombre: body.archivoNombre ?? archivo.originalname,
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

  private parseFecha(
    value: string | undefined,
    campo: string,
    finDelDia = false,
  ): Date | undefined {
    if (!value) {
      return undefined;
    }
    if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
      throw new BadRequestException(`${campo} debe tener el formato YYYY-MM-DD`);
    }
    const fecha = new Date(`${value}T${finDelDia ? '23:59:59.999' : '00:00:00'}`);
    if (Number.isNaN(fecha.getTime())) {
      throw new BadRequestException(`${campo} no es una fecha válida`);
    }
    return fecha;
  }

  private mapError(err: unknown): Error {
    if (
      err instanceof CuentaNotFoundError ||
      err instanceof AporteNotFoundError ||
      err instanceof InvitacionNotFoundError ||
      err instanceof SocioNotFoundError
    ) {
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

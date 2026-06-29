import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  InternalServerErrorException,
  Logger,
  NotFoundException,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthGuard } from '@nestjs/passport';
import {
  IMAGE_MIME_TYPES,
  MAX_UPLOAD_BYTES,
  assertAllowedMime,
  toBase64DataUri,
  type UploadedFileLike,
} from '@shared/presentation/uploaded-file';
import type {
  EstadoAporte,
  EstadoSolicitudCuenta,
  TipoSolicitudCuenta,
} from '@prisma/client';
import { UserRole } from '../../../auth/domain/user-role';
import { Roles } from '../../../auth/infrastructure/auth/roles.decorator';
import { RolesGuard } from '../../../auth/infrastructure/auth/roles.guard';
import {
  CurrentUser,
  type AuthUserPayload,
} from '../../../auth/infrastructure/auth/current-user.decorator';
import {
  AporteNotFoundError,
  BannerNotFoundError,
  CuentaConSaldoError,
  CuentaNotFoundError,
  MetaConfigInvalidaError,
  SaldoInsuficienteError,
  SocioNotFoundError,
  SolicitudCuentaNotFoundError,
  SolicitudYaResueltaError,
} from '../../domain/ahorro.errors';
import { CrearCuentaUseCase } from '../../application/use-cases/crear-cuenta.use-case';
import { ListarAportesUseCase } from '../../application/use-cases/listar-aportes.use-case';
import { VerificarAporteUseCase } from '../../application/use-cases/verificar-aporte.use-case';
import { GetMetaConfigUseCase } from '../../application/use-cases/get-meta-config.use-case';
import { ActualizarMetaConfigUseCase } from '../../application/use-cases/actualizar-meta-config.use-case';
import { ListarSociosAhorroUseCase } from '../../application/use-cases/listar-socios-ahorro.use-case';
import { GetSocioAhorroUseCase } from '../../application/use-cases/get-socio-ahorro.use-case';
import { ListarSolicitudesUseCase } from '../../application/use-cases/listar-solicitudes.use-case';
import { ResolverSolicitudUseCase } from '../../application/use-cases/resolver-solicitud.use-case';
import { ListarBannersAdminUseCase } from '../../application/use-cases/listar-banners-admin.use-case';
import { CrearBannerUseCase } from '../../application/use-cases/crear-banner.use-case';
import { ActualizarBannerUseCase } from '../../application/use-cases/actualizar-banner.use-case';
import { EliminarBannerUseCase } from '../../application/use-cases/eliminar-banner.use-case';
import { VerificarAporteHttpDto } from '../dto/verificar-aporte.http.dto';
import { ActualizarMetaConfigHttpDto } from '../dto/actualizar-meta-config.http.dto';
import { ResolverSolicitudHttpDto } from '../dto/resolver-solicitud.http.dto';
import { CrearCuentaHttpDto } from '../dto/crear-cuenta.http.dto';
import { parsePagination } from '@shared/presentation/parse-pagination';
import { CrearBannerHttpDto } from '../dto/crear-banner.http.dto';
import { ActualizarBannerHttpDto } from '../dto/actualizar-banner.http.dto';

const ESTADOS_APORTE: EstadoAporte[] = [
  'pendiente',
  'verificado',
  'incompleto',
  'atrasado',
  'rechazado',
];

@Controller('admin/ahorro')
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Roles(UserRole.ADMIN)
export class AdminAhorroController {
  private readonly logger = new Logger(AdminAhorroController.name);

  constructor(
    private readonly crearCuenta: CrearCuentaUseCase,
    private readonly listarAportes: ListarAportesUseCase,
    private readonly verificarAporte: VerificarAporteUseCase,
    private readonly getMetaConfig: GetMetaConfigUseCase,
    private readonly actualizarMetaConfig: ActualizarMetaConfigUseCase,
    private readonly listarSocios: ListarSociosAhorroUseCase,
    private readonly getSocio: GetSocioAhorroUseCase,
    private readonly listarSolicitudes: ListarSolicitudesUseCase,
    private readonly resolverSolicitud: ResolverSolicitudUseCase,
    private readonly listarBanners: ListarBannersAdminUseCase,
    private readonly crearBanner: CrearBannerUseCase,
    private readonly actualizarBanner: ActualizarBannerUseCase,
    private readonly eliminarBanner: EliminarBannerUseCase,
  ) {}

  @Post('socios/:socioId/cuentas')
  @HttpCode(201)
  async crearCuentaParaSocio(
    @Param('socioId', ParseUUIDPipe) socioId: string,
    @Body() body: CrearCuentaHttpDto,
  ) {
    try {
      return await this.crearCuenta.execute({
        socioId,
        nombre: body.nombre,
        tipo: body.tipo,
        moneda: body.moneda,
        color: body.color ?? null,
        icono: body.icono ?? null,
      });
    } catch (err) {
      throw this.mapError(err);
    }
  }

  @Get('aportes')
  async aportes(
    @Query('estado') estado?: string,
    @Query('mes') mes?: string,
    @Query('cuentaId') cuentaId?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    if (estado && !ESTADOS_APORTE.includes(estado as EstadoAporte)) {
      throw new BadRequestException(
        `estado debe ser uno de: ${ESTADOS_APORTE.join(', ')}`,
      );
    }
    if (mes && !/^\d{4}-(0[1-9]|1[0-2])$/.test(mes)) {
      throw new BadRequestException('mes debe tener el formato YYYY-MM');
    }
    const pagination = parsePagination(page, limit);
    return this.listarAportes.execute({
      estado: estado as EstadoAporte | undefined,
      mes,
      cuentaId,
      page: pagination.page,
      limit: pagination.limit,
    });
  }

  @Patch('aportes/:aporteId/estado')
  @HttpCode(200)
  async verificar(
    @CurrentUser() user: AuthUserPayload,
    @Param('aporteId', ParseUUIDPipe) aporteId: string,
    @Body() body: VerificarAporteHttpDto,
  ) {
    try {
      return await this.verificarAporte.execute({
        aporteId,
        estado: body.estado,
        observaciones: body.observaciones ?? null,
        verificadoPor: user.id,
      });
    } catch (err) {
      throw this.mapError(err);
    }
  }

  @Get('meta')
  async meta() {
    return this.getMetaConfig.execute();
  }

  @Patch('meta')
  @HttpCode(200)
  async actualizarMeta(@Body() body: ActualizarMetaConfigHttpDto) {
    if (
      body.metaMensual === undefined &&
      body.metaMinima === undefined &&
      body.metaMaxima === undefined
    ) {
      throw new BadRequestException(
        'Debes enviar al menos metaMensual, metaMinima o metaMaxima',
      );
    }
    try {
      return await this.actualizarMetaConfig.execute({
        metaMensual: body.metaMensual,
        metaMinima: body.metaMinima,
        metaMaxima: body.metaMaxima,
      });
    } catch (err) {
      throw this.mapError(err);
    }
  }

  @Get('socios')
  async socios(@Query('page') page?: string, @Query('limit') limit?: string) {
    const pagination = parsePagination(page, limit);
    return this.listarSocios.execute({
      page: pagination.page,
      limit: pagination.limit,
    });
  }

  @Get('socios/:socioId')
  async socio(@Param('socioId', ParseUUIDPipe) socioId: string) {
    try {
      return await this.getSocio.execute(socioId);
    } catch (err) {
      throw this.mapError(err);
    }
  }

  @Get('solicitudes')
  async solicitudes(
    @Query('estado') estado?: string,
    @Query('tipo') tipo?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    const pagination = parsePagination(page, limit);
    return this.listarSolicitudes.execute({
      estado: estado as EstadoSolicitudCuenta | undefined,
      tipo: tipo as TipoSolicitudCuenta | undefined,
      page: pagination.page,
      limit: pagination.limit,
    });
  }

  @Patch('solicitudes/:solicitudId/resolver')
  @HttpCode(200)
  async resolver(
    @CurrentUser() user: AuthUserPayload,
    @Param('solicitudId', ParseUUIDPipe) solicitudId: string,
    @Body() body: ResolverSolicitudHttpDto,
  ) {
    try {
      return await this.resolverSolicitud.execute({
        solicitudId,
        aprobar: body.aprobar,
        observaciones: body.observaciones ?? null,
        resueltoPor: user.id,
      });
    } catch (err) {
      throw this.mapError(err);
    }
  }

  @Get('banners')
  async banners() {
    return this.listarBanners.execute();
  }

  @Post('banners')
  @HttpCode(201)
  @UseInterceptors(
    FileInterceptor('imagen', { limits: { fileSize: MAX_UPLOAD_BYTES } }),
  )
  async crearBannerEndpoint(
    @UploadedFile() imagen: UploadedFileLike | undefined,
    @Body() body: CrearBannerHttpDto,
  ) {
    if (!imagen) {
      throw new BadRequestException('La imagen (campo imagen) es requerida');
    }
    assertAllowedMime(imagen, IMAGE_MIME_TYPES);
    return this.crearBanner.execute({
      titulo: body.titulo,
      subtitulo: body.subtitulo ?? null,
      imagenUrl: toBase64DataUri(imagen),
      orden: body.orden,
      activo: body.activo,
    });
  }

  @Patch('banners/:bannerId')
  @HttpCode(200)
  @UseInterceptors(
    FileInterceptor('imagen', { limits: { fileSize: MAX_UPLOAD_BYTES } }),
  )
  async actualizarBannerEndpoint(
    @Param('bannerId', ParseUUIDPipe) bannerId: string,
    @UploadedFile() imagen: UploadedFileLike | undefined,
    @Body() body: ActualizarBannerHttpDto,
  ) {
    let imagenUrl: string | undefined;
    if (imagen) {
      assertAllowedMime(imagen, IMAGE_MIME_TYPES);
      imagenUrl = toBase64DataUri(imagen);
    }
    try {
      return await this.actualizarBanner.execute({
        bannerId,
        titulo: body.titulo,
        subtitulo: body.subtitulo,
        imagenUrl,
        orden: body.orden,
        activo: body.activo,
      });
    } catch (err) {
      throw this.mapError(err);
    }
  }

  @Delete('banners/:bannerId')
  @HttpCode(200)
  async eliminarBannerEndpoint(
    @Param('bannerId', ParseUUIDPipe) bannerId: string,
  ) {
    try {
      await this.eliminarBanner.execute(bannerId);
      return { success: true };
    } catch (err) {
      throw this.mapError(err);
    }
  }

  private mapError(err: unknown): Error {
    if (
      err instanceof CuentaNotFoundError ||
      err instanceof AporteNotFoundError ||
      err instanceof SocioNotFoundError ||
      err instanceof SolicitudCuentaNotFoundError ||
      err instanceof BannerNotFoundError
    ) {
      return new NotFoundException(err.message);
    }
    if (
      err instanceof SolicitudYaResueltaError ||
      err instanceof SaldoInsuficienteError ||
      err instanceof CuentaConSaldoError ||
      err instanceof MetaConfigInvalidaError
    ) {
      return new BadRequestException(err.message);
    }
    this.logger.error(
      'Error no controlado en AdminAhorroController',
      err instanceof Error ? err.stack : String(err),
    );
    return new InternalServerErrorException();
  }
}

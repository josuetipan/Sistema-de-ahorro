"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var AdminAhorroController_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminAhorroController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const passport_1 = require("@nestjs/passport");
const uploaded_file_1 = require("../../../../shared/presentation/uploaded-file");
const user_role_1 = require("../../../auth/domain/user-role");
const roles_decorator_1 = require("../../../auth/infrastructure/auth/roles.decorator");
const roles_guard_1 = require("../../../auth/infrastructure/auth/roles.guard");
const current_user_decorator_1 = require("../../../auth/infrastructure/auth/current-user.decorator");
const ahorro_errors_1 = require("../../domain/ahorro.errors");
const crear_cuenta_use_case_1 = require("../../application/use-cases/crear-cuenta.use-case");
const listar_aportes_use_case_1 = require("../../application/use-cases/listar-aportes.use-case");
const verificar_aporte_use_case_1 = require("../../application/use-cases/verificar-aporte.use-case");
const get_meta_config_use_case_1 = require("../../application/use-cases/get-meta-config.use-case");
const actualizar_meta_config_use_case_1 = require("../../application/use-cases/actualizar-meta-config.use-case");
const listar_socios_ahorro_use_case_1 = require("../../application/use-cases/listar-socios-ahorro.use-case");
const get_socio_ahorro_use_case_1 = require("../../application/use-cases/get-socio-ahorro.use-case");
const listar_solicitudes_use_case_1 = require("../../application/use-cases/listar-solicitudes.use-case");
const resolver_solicitud_use_case_1 = require("../../application/use-cases/resolver-solicitud.use-case");
const listar_banners_admin_use_case_1 = require("../../application/use-cases/listar-banners-admin.use-case");
const crear_banner_use_case_1 = require("../../application/use-cases/crear-banner.use-case");
const actualizar_banner_use_case_1 = require("../../application/use-cases/actualizar-banner.use-case");
const eliminar_banner_use_case_1 = require("../../application/use-cases/eliminar-banner.use-case");
const verificar_aporte_http_dto_1 = require("../dto/verificar-aporte.http.dto");
const actualizar_meta_config_http_dto_1 = require("../dto/actualizar-meta-config.http.dto");
const resolver_solicitud_http_dto_1 = require("../dto/resolver-solicitud.http.dto");
const crear_cuenta_http_dto_1 = require("../dto/crear-cuenta.http.dto");
const parse_pagination_1 = require("../../../../shared/presentation/parse-pagination");
const crear_banner_http_dto_1 = require("../dto/crear-banner.http.dto");
const actualizar_banner_http_dto_1 = require("../dto/actualizar-banner.http.dto");
const ESTADOS_APORTE = [
    'pendiente',
    'verificado',
    'incompleto',
    'atrasado',
    'rechazado',
];
let AdminAhorroController = AdminAhorroController_1 = class AdminAhorroController {
    crearCuenta;
    listarAportes;
    verificarAporte;
    getMetaConfig;
    actualizarMetaConfig;
    listarSocios;
    getSocio;
    listarSolicitudes;
    resolverSolicitud;
    listarBanners;
    crearBanner;
    actualizarBanner;
    eliminarBanner;
    logger = new common_1.Logger(AdminAhorroController_1.name);
    constructor(crearCuenta, listarAportes, verificarAporte, getMetaConfig, actualizarMetaConfig, listarSocios, getSocio, listarSolicitudes, resolverSolicitud, listarBanners, crearBanner, actualizarBanner, eliminarBanner) {
        this.crearCuenta = crearCuenta;
        this.listarAportes = listarAportes;
        this.verificarAporte = verificarAporte;
        this.getMetaConfig = getMetaConfig;
        this.actualizarMetaConfig = actualizarMetaConfig;
        this.listarSocios = listarSocios;
        this.getSocio = getSocio;
        this.listarSolicitudes = listarSolicitudes;
        this.resolverSolicitud = resolverSolicitud;
        this.listarBanners = listarBanners;
        this.crearBanner = crearBanner;
        this.actualizarBanner = actualizarBanner;
        this.eliminarBanner = eliminarBanner;
    }
    async crearCuentaParaSocio(socioId, body) {
        try {
            return await this.crearCuenta.execute({
                socioId,
                nombre: body.nombre,
                tipo: body.tipo,
                moneda: body.moneda,
                color: body.color ?? null,
                icono: body.icono ?? null,
            });
        }
        catch (err) {
            throw this.mapError(err);
        }
    }
    async aportes(estado, mes, cuentaId, page, limit) {
        if (estado && !ESTADOS_APORTE.includes(estado)) {
            throw new common_1.BadRequestException(`estado debe ser uno de: ${ESTADOS_APORTE.join(', ')}`);
        }
        if (mes && !/^\d{4}-(0[1-9]|1[0-2])$/.test(mes)) {
            throw new common_1.BadRequestException('mes debe tener el formato YYYY-MM');
        }
        const pagination = (0, parse_pagination_1.parsePagination)(page, limit);
        return this.listarAportes.execute({
            estado: estado,
            mes,
            cuentaId,
            page: pagination.page,
            limit: pagination.limit,
        });
    }
    async verificar(user, aporteId, body) {
        try {
            return await this.verificarAporte.execute({
                aporteId,
                estado: body.estado,
                observaciones: body.observaciones ?? null,
                verificadoPor: user.id,
            });
        }
        catch (err) {
            throw this.mapError(err);
        }
    }
    async meta() {
        return this.getMetaConfig.execute();
    }
    async actualizarMeta(body) {
        if (body.metaMensual === undefined &&
            body.metaMinima === undefined &&
            body.metaMaxima === undefined) {
            throw new common_1.BadRequestException('Debes enviar al menos metaMensual, metaMinima o metaMaxima');
        }
        try {
            return await this.actualizarMetaConfig.execute({
                metaMensual: body.metaMensual,
                metaMinima: body.metaMinima,
                metaMaxima: body.metaMaxima,
            });
        }
        catch (err) {
            throw this.mapError(err);
        }
    }
    async socios(page, limit) {
        const pagination = (0, parse_pagination_1.parsePagination)(page, limit);
        return this.listarSocios.execute({
            page: pagination.page,
            limit: pagination.limit,
        });
    }
    async socio(socioId) {
        try {
            return await this.getSocio.execute(socioId);
        }
        catch (err) {
            throw this.mapError(err);
        }
    }
    async solicitudes(estado, tipo, page, limit) {
        const pagination = (0, parse_pagination_1.parsePagination)(page, limit);
        return this.listarSolicitudes.execute({
            estado: estado,
            tipo: tipo,
            page: pagination.page,
            limit: pagination.limit,
        });
    }
    async resolver(user, solicitudId, body) {
        try {
            return await this.resolverSolicitud.execute({
                solicitudId,
                aprobar: body.aprobar,
                observaciones: body.observaciones ?? null,
                resueltoPor: user.id,
            });
        }
        catch (err) {
            throw this.mapError(err);
        }
    }
    async banners() {
        return this.listarBanners.execute();
    }
    async crearBannerEndpoint(imagen, body) {
        if (!imagen) {
            throw new common_1.BadRequestException('La imagen (campo imagen) es requerida');
        }
        (0, uploaded_file_1.assertAllowedMime)(imagen, uploaded_file_1.IMAGE_MIME_TYPES);
        return this.crearBanner.execute({
            titulo: body.titulo,
            subtitulo: body.subtitulo ?? null,
            imagenUrl: (0, uploaded_file_1.toBase64DataUri)(imagen),
            orden: body.orden,
            activo: body.activo,
        });
    }
    async actualizarBannerEndpoint(bannerId, imagen, body) {
        let imagenUrl;
        if (imagen) {
            (0, uploaded_file_1.assertAllowedMime)(imagen, uploaded_file_1.IMAGE_MIME_TYPES);
            imagenUrl = (0, uploaded_file_1.toBase64DataUri)(imagen);
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
        }
        catch (err) {
            throw this.mapError(err);
        }
    }
    async eliminarBannerEndpoint(bannerId) {
        try {
            await this.eliminarBanner.execute(bannerId);
            return { success: true };
        }
        catch (err) {
            throw this.mapError(err);
        }
    }
    mapError(err) {
        if (err instanceof ahorro_errors_1.CuentaNotFoundError ||
            err instanceof ahorro_errors_1.AporteNotFoundError ||
            err instanceof ahorro_errors_1.SocioNotFoundError ||
            err instanceof ahorro_errors_1.SolicitudCuentaNotFoundError ||
            err instanceof ahorro_errors_1.BannerNotFoundError) {
            return new common_1.NotFoundException(err.message);
        }
        if (err instanceof ahorro_errors_1.SolicitudYaResueltaError ||
            err instanceof ahorro_errors_1.SaldoInsuficienteError ||
            err instanceof ahorro_errors_1.CuentaConSaldoError ||
            err instanceof ahorro_errors_1.MetaConfigInvalidaError) {
            return new common_1.BadRequestException(err.message);
        }
        this.logger.error('Error no controlado en AdminAhorroController', err instanceof Error ? err.stack : String(err));
        return new common_1.InternalServerErrorException();
    }
};
exports.AdminAhorroController = AdminAhorroController;
__decorate([
    (0, common_1.Post)('socios/:socioId/cuentas'),
    (0, common_1.HttpCode)(201),
    __param(0, (0, common_1.Param)('socioId', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, crear_cuenta_http_dto_1.CrearCuentaHttpDto]),
    __metadata("design:returntype", Promise)
], AdminAhorroController.prototype, "crearCuentaParaSocio", null);
__decorate([
    (0, common_1.Get)('aportes'),
    __param(0, (0, common_1.Query)('estado')),
    __param(1, (0, common_1.Query)('mes')),
    __param(2, (0, common_1.Query)('cuentaId')),
    __param(3, (0, common_1.Query)('page')),
    __param(4, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String, String]),
    __metadata("design:returntype", Promise)
], AdminAhorroController.prototype, "aportes", null);
__decorate([
    (0, common_1.Patch)('aportes/:aporteId/estado'),
    (0, common_1.HttpCode)(200),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('aporteId', common_1.ParseUUIDPipe)),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, verificar_aporte_http_dto_1.VerificarAporteHttpDto]),
    __metadata("design:returntype", Promise)
], AdminAhorroController.prototype, "verificar", null);
__decorate([
    (0, common_1.Get)('meta'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AdminAhorroController.prototype, "meta", null);
__decorate([
    (0, common_1.Patch)('meta'),
    (0, common_1.HttpCode)(200),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [actualizar_meta_config_http_dto_1.ActualizarMetaConfigHttpDto]),
    __metadata("design:returntype", Promise)
], AdminAhorroController.prototype, "actualizarMeta", null);
__decorate([
    (0, common_1.Get)('socios'),
    __param(0, (0, common_1.Query)('page')),
    __param(1, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], AdminAhorroController.prototype, "socios", null);
__decorate([
    (0, common_1.Get)('socios/:socioId'),
    __param(0, (0, common_1.Param)('socioId', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AdminAhorroController.prototype, "socio", null);
__decorate([
    (0, common_1.Get)('solicitudes'),
    __param(0, (0, common_1.Query)('estado')),
    __param(1, (0, common_1.Query)('tipo')),
    __param(2, (0, common_1.Query)('page')),
    __param(3, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String]),
    __metadata("design:returntype", Promise)
], AdminAhorroController.prototype, "solicitudes", null);
__decorate([
    (0, common_1.Patch)('solicitudes/:solicitudId/resolver'),
    (0, common_1.HttpCode)(200),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('solicitudId', common_1.ParseUUIDPipe)),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, resolver_solicitud_http_dto_1.ResolverSolicitudHttpDto]),
    __metadata("design:returntype", Promise)
], AdminAhorroController.prototype, "resolver", null);
__decorate([
    (0, common_1.Get)('banners'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AdminAhorroController.prototype, "banners", null);
__decorate([
    (0, common_1.Post)('banners'),
    (0, common_1.HttpCode)(201),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('imagen', { limits: { fileSize: uploaded_file_1.MAX_UPLOAD_BYTES } })),
    __param(0, (0, common_1.UploadedFile)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, crear_banner_http_dto_1.CrearBannerHttpDto]),
    __metadata("design:returntype", Promise)
], AdminAhorroController.prototype, "crearBannerEndpoint", null);
__decorate([
    (0, common_1.Patch)('banners/:bannerId'),
    (0, common_1.HttpCode)(200),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('imagen', { limits: { fileSize: uploaded_file_1.MAX_UPLOAD_BYTES } })),
    __param(0, (0, common_1.Param)('bannerId', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.UploadedFile)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, actualizar_banner_http_dto_1.ActualizarBannerHttpDto]),
    __metadata("design:returntype", Promise)
], AdminAhorroController.prototype, "actualizarBannerEndpoint", null);
__decorate([
    (0, common_1.Delete)('banners/:bannerId'),
    (0, common_1.HttpCode)(200),
    __param(0, (0, common_1.Param)('bannerId', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AdminAhorroController.prototype, "eliminarBannerEndpoint", null);
exports.AdminAhorroController = AdminAhorroController = AdminAhorroController_1 = __decorate([
    (0, common_1.Controller)('admin/ahorro'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt'), roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(user_role_1.UserRole.ADMIN),
    __metadata("design:paramtypes", [crear_cuenta_use_case_1.CrearCuentaUseCase,
        listar_aportes_use_case_1.ListarAportesUseCase,
        verificar_aporte_use_case_1.VerificarAporteUseCase,
        get_meta_config_use_case_1.GetMetaConfigUseCase,
        actualizar_meta_config_use_case_1.ActualizarMetaConfigUseCase,
        listar_socios_ahorro_use_case_1.ListarSociosAhorroUseCase,
        get_socio_ahorro_use_case_1.GetSocioAhorroUseCase,
        listar_solicitudes_use_case_1.ListarSolicitudesUseCase,
        resolver_solicitud_use_case_1.ResolverSolicitudUseCase,
        listar_banners_admin_use_case_1.ListarBannersAdminUseCase,
        crear_banner_use_case_1.CrearBannerUseCase,
        actualizar_banner_use_case_1.ActualizarBannerUseCase,
        eliminar_banner_use_case_1.EliminarBannerUseCase])
], AdminAhorroController);
//# sourceMappingURL=admin-ahorro.controller.js.map
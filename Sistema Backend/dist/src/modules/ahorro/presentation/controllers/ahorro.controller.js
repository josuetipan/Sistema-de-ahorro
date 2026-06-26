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
var AhorroController_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AhorroController = void 0;
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
const user_role_1 = require("../../../auth/domain/user-role");
const roles_decorator_1 = require("../../../auth/infrastructure/auth/roles.decorator");
const roles_guard_1 = require("../../../auth/infrastructure/auth/roles.guard");
const current_user_decorator_1 = require("../../../auth/infrastructure/auth/current-user.decorator");
const ahorro_errors_1 = require("../../domain/ahorro.errors");
const get_mis_cuentas_use_case_1 = require("../../application/use-cases/get-mis-cuentas.use-case");
const get_meta_config_use_case_1 = require("../../application/use-cases/get-meta-config.use-case");
const get_calendario_cuenta_use_case_1 = require("../../application/use-cases/get-calendario-cuenta.use-case");
const registrar_aporte_use_case_1 = require("../../application/use-cases/registrar-aporte.use-case");
const crear_solicitud_cuenta_use_case_1 = require("../../application/use-cases/crear-solicitud-cuenta.use-case");
const listar_mis_solicitudes_use_case_1 = require("../../application/use-cases/listar-mis-solicitudes.use-case");
const registrar_aporte_http_dto_1 = require("../dto/registrar-aporte.http.dto");
const crear_solicitud_http_dto_1 = require("../dto/crear-solicitud.http.dto");
let AhorroController = AhorroController_1 = class AhorroController {
    getMisCuentas;
    getMetaConfig;
    getCalendario;
    registrarAporte;
    crearSolicitud;
    listarMisSolicitudes;
    logger = new common_1.Logger(AhorroController_1.name);
    constructor(getMisCuentas, getMetaConfig, getCalendario, registrarAporte, crearSolicitud, listarMisSolicitudes) {
        this.getMisCuentas = getMisCuentas;
        this.getMetaConfig = getMetaConfig;
        this.getCalendario = getCalendario;
        this.registrarAporte = registrarAporte;
        this.crearSolicitud = crearSolicitud;
        this.listarMisSolicitudes = listarMisSolicitudes;
    }
    async misCuentas(user) {
        return this.getMisCuentas.execute(user.id);
    }
    async meta() {
        return this.getMetaConfig.execute();
    }
    async calendario(user, cuentaId, anio) {
        const year = anio ? Number(anio) : new Date().getFullYear();
        if (!Number.isInteger(year) || year < 2000 || year > 2100) {
            throw new common_1.BadRequestException('anio inválido');
        }
        try {
            return await this.getCalendario.execute({
                userId: user.id,
                cuentaId,
                anio: year,
            });
        }
        catch (err) {
            throw this.mapError(err);
        }
    }
    async registrarAportePago(user, cuentaId, body) {
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
        }
        catch (err) {
            throw this.mapError(err);
        }
    }
    async solicitar(user, cuentaId, body) {
        try {
            return await this.crearSolicitud.execute({
                userId: user.id,
                cuentaOrigenId: cuentaId,
                tipo: body.tipo,
                monto: body.monto ?? null,
                cuentaDestinoId: body.cuentaDestinoId ?? null,
                motivo: body.motivo ?? null,
            });
        }
        catch (err) {
            throw this.mapError(err);
        }
    }
    async misSolicitudes(user) {
        return this.listarMisSolicitudes.execute(user.id);
    }
    mapError(err) {
        if (err instanceof ahorro_errors_1.CuentaNotFoundError) {
            return new common_1.NotFoundException(err.message);
        }
        if (err instanceof ahorro_errors_1.CuentaForbiddenError) {
            return new common_1.ForbiddenException(err.message);
        }
        if (err instanceof ahorro_errors_1.AporteMesAlreadyExistsError ||
            err instanceof ahorro_errors_1.ComprobanteAlreadyTakenError) {
            return new common_1.BadRequestException(err.message);
        }
        if (err instanceof ahorro_errors_1.SaldoInsuficienteError) {
            return new common_1.BadRequestException(err.message);
        }
        this.logger.error('Error no controlado en AhorroController', err instanceof Error ? err.stack : String(err));
        return new common_1.InternalServerErrorException();
    }
};
exports.AhorroController = AhorroController;
__decorate([
    (0, common_1.Get)('mis-cuentas'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AhorroController.prototype, "misCuentas", null);
__decorate([
    (0, common_1.Get)('meta'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AhorroController.prototype, "meta", null);
__decorate([
    (0, common_1.Get)('cuentas/:cuentaId/calendario'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('cuentaId', common_1.ParseUUIDPipe)),
    __param(2, (0, common_1.Query)('anio')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String]),
    __metadata("design:returntype", Promise)
], AhorroController.prototype, "calendario", null);
__decorate([
    (0, common_1.Post)('cuentas/:cuentaId/aportes'),
    (0, common_1.HttpCode)(201),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('cuentaId', common_1.ParseUUIDPipe)),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, registrar_aporte_http_dto_1.RegistrarAporteHttpDto]),
    __metadata("design:returntype", Promise)
], AhorroController.prototype, "registrarAportePago", null);
__decorate([
    (0, common_1.Post)('cuentas/:cuentaId/solicitudes'),
    (0, common_1.HttpCode)(201),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('cuentaId', common_1.ParseUUIDPipe)),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, crear_solicitud_http_dto_1.CrearSolicitudHttpDto]),
    __metadata("design:returntype", Promise)
], AhorroController.prototype, "solicitar", null);
__decorate([
    (0, common_1.Get)('mis-solicitudes'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AhorroController.prototype, "misSolicitudes", null);
exports.AhorroController = AhorroController = AhorroController_1 = __decorate([
    (0, common_1.Controller)('ahorro'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt'), roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(user_role_1.UserRole.CUSTOMER),
    __metadata("design:paramtypes", [get_mis_cuentas_use_case_1.GetMisCuentasUseCase,
        get_meta_config_use_case_1.GetMetaConfigUseCase,
        get_calendario_cuenta_use_case_1.GetCalendarioCuentaUseCase,
        registrar_aporte_use_case_1.RegistrarAporteUseCase,
        crear_solicitud_cuenta_use_case_1.CrearSolicitudCuentaUseCase,
        listar_mis_solicitudes_use_case_1.ListarMisSolicitudesUseCase])
], AhorroController);
//# sourceMappingURL=ahorro.controller.js.map
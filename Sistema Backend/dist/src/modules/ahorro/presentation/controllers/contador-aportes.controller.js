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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContadorAportesController = void 0;
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
const user_role_1 = require("../../../auth/domain/user-role");
const roles_decorator_1 = require("../../../auth/infrastructure/auth/roles.decorator");
const roles_guard_1 = require("../../../auth/infrastructure/auth/roles.guard");
const current_user_decorator_1 = require("../../../auth/infrastructure/auth/current-user.decorator");
const listar_aportes_use_case_1 = require("../../application/use-cases/listar-aportes.use-case");
const verificar_aporte_use_case_1 = require("../../application/use-cases/verificar-aporte.use-case");
const verificar_aporte_http_dto_1 = require("../dto/verificar-aporte.http.dto");
const get_comprobante_aporte_admin_use_case_1 = require("../../application/use-cases/get-comprobante-aporte-admin.use-case");
const parse_pagination_1 = require("../../../../shared/presentation/parse-pagination");
let ContadorAportesController = class ContadorAportesController {
    listarAportes;
    verificarAporte;
    getComprobanteAporte;
    constructor(listarAportes, verificarAporte, getComprobanteAporte) {
        this.listarAportes = listarAportes;
        this.verificarAporte = verificarAporte;
        this.getComprobanteAporte = getComprobanteAporte;
    }
    list(estado, page, limit) {
        const pagination = (0, parse_pagination_1.parsePagination)(page, limit);
        return this.listarAportes.execute({ estado, page: pagination.page, limit: pagination.limit });
    }
    async comprobante(aporteId) {
        try {
            return await this.getComprobanteAporte.execute(aporteId);
        }
        catch {
            throw new common_1.NotFoundException('Comprobante no encontrado');
        }
    }
    async verify(user, aporteId, body) {
        try {
            return await this.verificarAporte.execute({
                aporteId,
                estado: body.estado,
                observaciones: body.observaciones ?? null,
                verificadoPor: user.id,
            });
        }
        catch {
            throw new common_1.NotFoundException('Aporte no encontrado');
        }
    }
};
exports.ContadorAportesController = ContadorAportesController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('estado')),
    __param(1, (0, common_1.Query)('page')),
    __param(2, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", void 0)
], ContadorAportesController.prototype, "list", null);
__decorate([
    (0, common_1.Get)(':aporteId/comprobante'),
    __param(0, (0, common_1.Param)('aporteId', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ContadorAportesController.prototype, "comprobante", null);
__decorate([
    (0, common_1.Patch)(':aporteId/estado'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('aporteId', common_1.ParseUUIDPipe)),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, verificar_aporte_http_dto_1.VerificarAporteHttpDto]),
    __metadata("design:returntype", Promise)
], ContadorAportesController.prototype, "verify", null);
exports.ContadorAportesController = ContadorAportesController = __decorate([
    (0, common_1.Controller)('contador/aportes'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt'), roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(user_role_1.UserRole.ADMIN, user_role_1.UserRole.ACCOUNTANT),
    __metadata("design:paramtypes", [listar_aportes_use_case_1.ListarAportesUseCase,
        verificar_aporte_use_case_1.VerificarAporteUseCase,
        get_comprobante_aporte_admin_use_case_1.GetComprobanteAporteAdminUseCase])
], ContadorAportesController);
//# sourceMappingURL=contador-aportes.controller.js.map
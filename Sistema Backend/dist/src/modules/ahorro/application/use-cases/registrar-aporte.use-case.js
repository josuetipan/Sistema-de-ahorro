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
exports.RegistrarAporteUseCase = void 0;
const common_1 = require("@nestjs/common");
const ahorro_errors_1 = require("../../domain/ahorro.errors");
const cuenta_repository_port_1 = require("../../domain/ports/cuenta.repository.port");
const aporte_repository_port_1 = require("../../domain/ports/aporte.repository.port");
const meta_config_repository_port_1 = require("../../domain/ports/meta-config.repository.port");
let RegistrarAporteUseCase = class RegistrarAporteUseCase {
    cuentas;
    aportes;
    metaConfig;
    constructor(cuentas, aportes, metaConfig) {
        this.cuentas = cuentas;
        this.aportes = aportes;
        this.metaConfig = metaConfig;
    }
    async execute(input) {
        const ownership = await this.cuentas.findOwnership(input.cuentaId);
        if (!ownership) {
            throw new ahorro_errors_1.CuentaNotFoundError(input.cuentaId);
        }
        if (ownership.userId !== input.userId) {
            throw new ahorro_errors_1.CuentaForbiddenError();
        }
        const yaExiste = await this.aportes.existsByCuentaAndMes(input.cuentaId, input.mes);
        if (yaExiste) {
            throw new ahorro_errors_1.AporteMesAlreadyExistsError(input.mes);
        }
        const comprobanteUsado = await this.aportes.existsByComprobante(input.comprobante);
        if (comprobanteUsado) {
            throw new ahorro_errors_1.ComprobanteAlreadyTakenError();
        }
        const meta = await this.metaConfig.getOrCreate();
        return this.aportes.create({
            cuentaId: input.cuentaId,
            mes: input.mes,
            monto: input.monto,
            metaMensual: meta.metaMensual,
            referencia: input.referencia ?? null,
            comprobante: input.comprobante,
            urlArchivo: input.urlArchivo,
            archivoNombre: input.archivoNombre ?? null,
            descripcion: input.descripcion ?? null,
        });
    }
};
exports.RegistrarAporteUseCase = RegistrarAporteUseCase;
exports.RegistrarAporteUseCase = RegistrarAporteUseCase = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(cuenta_repository_port_1.CUENTA_REPOSITORY)),
    __param(1, (0, common_1.Inject)(aporte_repository_port_1.APORTE_REPOSITORY)),
    __param(2, (0, common_1.Inject)(meta_config_repository_port_1.META_CONFIG_REPOSITORY)),
    __metadata("design:paramtypes", [Object, Object, Object])
], RegistrarAporteUseCase);
//# sourceMappingURL=registrar-aporte.use-case.js.map
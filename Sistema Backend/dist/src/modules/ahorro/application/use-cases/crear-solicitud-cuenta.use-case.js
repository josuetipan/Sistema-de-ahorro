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
exports.CrearSolicitudCuentaUseCase = void 0;
const common_1 = require("@nestjs/common");
const ahorro_errors_1 = require("../../domain/ahorro.errors");
const cuenta_repository_port_1 = require("../../domain/ports/cuenta.repository.port");
const solicitud_cuenta_repository_port_1 = require("../../domain/ports/solicitud-cuenta.repository.port");
let CrearSolicitudCuentaUseCase = class CrearSolicitudCuentaUseCase {
    cuentas;
    solicitudes;
    constructor(cuentas, solicitudes) {
        this.cuentas = cuentas;
        this.solicitudes = solicitudes;
    }
    async execute(input) {
        const origen = await this.cuentas.findOwnership(input.cuentaOrigenId);
        if (!origen) {
            throw new ahorro_errors_1.CuentaNotFoundError(input.cuentaOrigenId);
        }
        if (origen.userId !== input.userId) {
            throw new ahorro_errors_1.CuentaForbiddenError();
        }
        if (input.cuentaDestinoId) {
            const destino = await this.cuentas.findOwnership(input.cuentaDestinoId);
            if (!destino) {
                throw new ahorro_errors_1.CuentaNotFoundError(input.cuentaDestinoId);
            }
            if (destino.userId !== input.userId) {
                throw new ahorro_errors_1.CuentaForbiddenError();
            }
        }
        if (input.tipo === 'retiro') {
            const monto = input.monto ?? 0;
            if (monto <= 0 || monto > origen.saldo) {
                throw new ahorro_errors_1.SaldoInsuficienteError();
            }
        }
        return this.solicitudes.create({
            cuentaOrigenId: input.cuentaOrigenId,
            cuentaDestinoId: input.cuentaDestinoId ?? null,
            tipo: input.tipo,
            monto: input.tipo === 'retiro' ? input.monto ?? null : null,
            motivo: input.motivo ?? null,
        });
    }
};
exports.CrearSolicitudCuentaUseCase = CrearSolicitudCuentaUseCase;
exports.CrearSolicitudCuentaUseCase = CrearSolicitudCuentaUseCase = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(cuenta_repository_port_1.CUENTA_REPOSITORY)),
    __param(1, (0, common_1.Inject)(solicitud_cuenta_repository_port_1.SOLICITUD_CUENTA_REPOSITORY)),
    __metadata("design:paramtypes", [Object, Object])
], CrearSolicitudCuentaUseCase);
//# sourceMappingURL=crear-solicitud-cuenta.use-case.js.map
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
exports.GetResumenAhorroUseCase = void 0;
const common_1 = require("@nestjs/common");
const cuenta_repository_port_1 = require("../../domain/ports/cuenta.repository.port");
const aporte_repository_port_1 = require("../../domain/ports/aporte.repository.port");
const meta_config_repository_port_1 = require("../../domain/ports/meta-config.repository.port");
function mesActualKey(date = new Date()) {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
}
let GetResumenAhorroUseCase = class GetResumenAhorroUseCase {
    cuentas;
    aportes;
    metaConfig;
    constructor(cuentas, aportes, metaConfig) {
        this.cuentas = cuentas;
        this.aportes = aportes;
        this.metaConfig = metaConfig;
    }
    async execute(userId) {
        const mesActual = mesActualKey();
        const [cuentas, agregados, meta] = await Promise.all([
            this.cuentas.listByUserId(userId),
            this.aportes.listAggregatesByUser(userId, mesActual),
            this.metaConfig.getOrCreate(),
        ]);
        const agregadoPorCuenta = new Map(agregados.map((a) => [a.cuentaId, a]));
        const cuentasResumen = cuentas.map((cuenta) => {
            const agregado = agregadoPorCuenta.get(cuenta.idCuenta);
            const saldoPendiente = agregado?.saldoPendiente ?? 0;
            const progresoMes = agregado?.progresoMes ?? 0;
            return {
                cuentaId: cuenta.idCuenta,
                numeroCuenta: cuenta.numeroCuenta,
                nombre: cuenta.nombre,
                estado: cuenta.estado,
                saldo: cuenta.saldo,
                saldoDisponible: cuenta.saldoDisponible,
                saldoPendiente,
                progresoMes,
                metaMensual: meta.metaMensual,
                metaCumplida: progresoMes >= meta.metaMensual && meta.metaMensual > 0,
            };
        });
        return {
            mesActual,
            metaMensual: meta.metaMensual,
            metaMinima: meta.metaMinima,
            metaMaxima: meta.metaMaxima,
            totalAhorradoGlobal: cuentasResumen.reduce((acc, c) => acc + c.saldo, 0),
            saldoDisponibleGlobal: cuentasResumen.reduce((acc, c) => acc + c.saldoDisponible, 0),
            saldoPendienteGlobal: cuentasResumen.reduce((acc, c) => acc + c.saldoPendiente, 0),
            progresoMesGlobal: cuentasResumen.reduce((acc, c) => acc + c.progresoMes, 0),
            cantidadCuentas: cuentasResumen.length,
            cuentas: cuentasResumen,
        };
    }
};
exports.GetResumenAhorroUseCase = GetResumenAhorroUseCase;
exports.GetResumenAhorroUseCase = GetResumenAhorroUseCase = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(cuenta_repository_port_1.CUENTA_REPOSITORY)),
    __param(1, (0, common_1.Inject)(aporte_repository_port_1.APORTE_REPOSITORY)),
    __param(2, (0, common_1.Inject)(meta_config_repository_port_1.META_CONFIG_REPOSITORY)),
    __metadata("design:paramtypes", [Object, Object, Object])
], GetResumenAhorroUseCase);
//# sourceMappingURL=get-resumen-ahorro.use-case.js.map
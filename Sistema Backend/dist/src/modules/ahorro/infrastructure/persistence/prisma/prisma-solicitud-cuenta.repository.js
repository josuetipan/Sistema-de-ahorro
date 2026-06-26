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
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrismaSolicitudCuentaRepository = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../../../../shared/infrastructure/prisma/prisma.service");
const ahorro_errors_1 = require("../../../domain/ahorro.errors");
function numOrNull(value) {
    return value === null ? null : value.toNumber();
}
function toResumen(row) {
    return {
        idSolicitudCuenta: row.id_solicitud_cuenta,
        cuentaOrigenId: row.cuenta_origen_id,
        cuentaDestinoId: row.cuenta_destino_id,
        tipo: row.tipo,
        monto: numOrNull(row.monto),
        motivo: row.motivo,
        estado: row.estado,
        observaciones: row.observaciones,
        resueltoPor: row.resuelto_por,
        fechaResolucion: row.fecha_resolucion,
        createdAt: row.createdAt,
    };
}
let PrismaSolicitudCuentaRepository = class PrismaSolicitudCuentaRepository {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(input) {
        const row = await this.prisma.solicitudCuenta.create({
            data: {
                cuenta_origen_id: input.cuentaOrigenId,
                cuenta_destino_id: input.cuentaDestinoId ?? null,
                tipo: input.tipo,
                monto: input.monto ?? null,
                motivo: input.motivo ?? null,
                estado: 'pendiente',
            },
        });
        return toResumen(row);
    }
    async findById(solicitudId) {
        const row = await this.prisma.solicitudCuenta.findUnique({
            where: { id_solicitud_cuenta: solicitudId },
        });
        return row ? toResumen(row) : null;
    }
    async listForAdmin(filtro) {
        const rows = await this.prisma.solicitudCuenta.findMany({
            where: { estado: filtro.estado, tipo: filtro.tipo },
            include: {
                cuentaOrigen: {
                    select: {
                        numeroCuenta: true,
                        socio: {
                            select: {
                                id_socio: true,
                                user: { select: { full_name: true } },
                            },
                        },
                    },
                },
            },
            orderBy: { createdAt: 'desc' },
        });
        return rows.map((row) => ({
            ...toResumen(row),
            numeroCuentaOrigen: row.cuentaOrigen.numeroCuenta,
            socioId: row.cuentaOrigen.socio.id_socio,
            socioNombre: row.cuentaOrigen.socio.user.full_name,
        }));
    }
    async listByUserId(userId) {
        const rows = await this.prisma.solicitudCuenta.findMany({
            where: { cuentaOrigen: { socio: { user_id: userId } } },
            orderBy: { createdAt: 'desc' },
        });
        return rows.map(toResumen);
    }
    async rechazar(solicitudId, resueltoPor, observaciones) {
        const row = await this.prisma.solicitudCuenta.update({
            where: { id_solicitud_cuenta: solicitudId },
            data: {
                estado: 'rechazada',
                resuelto_por: resueltoPor,
                observaciones: observaciones ?? null,
                fecha_resolucion: new Date(),
            },
        });
        return toResumen(row);
    }
    async aprobar(solicitudId, resueltoPor, observaciones) {
        const solicitud = await this.prisma.solicitudCuenta.findUnique({
            where: { id_solicitud_cuenta: solicitudId },
            include: { cuentaOrigen: true },
        });
        if (!solicitud) {
            throw new Error(`Solicitud inexistente: ${solicitudId}`);
        }
        const saldoOrigen = solicitud.cuentaOrigen.saldo.toNumber();
        const updated = await this.prisma.$transaction(async (tx) => {
            if (solicitud.tipo === 'retiro') {
                const monto = solicitud.monto ? solicitud.monto.toNumber() : 0;
                if (monto <= 0 || monto > saldoOrigen) {
                    throw new ahorro_errors_1.SaldoInsuficienteError();
                }
                await tx.cuenta.update({
                    where: { id_cuenta: solicitud.cuenta_origen_id },
                    data: {
                        saldo: { decrement: monto },
                        saldoDisponible: { decrement: monto },
                        totalRetiros: { increment: monto },
                    },
                });
                const esTransferencia = Boolean(solicitud.cuenta_destino_id);
                if (esTransferencia) {
                    await tx.cuenta.update({
                        where: { id_cuenta: solicitud.cuenta_destino_id },
                        data: {
                            saldo: { increment: monto },
                            saldoDisponible: { increment: monto },
                            totalDepositos: { increment: monto },
                        },
                    });
                }
                await tx.transaccion.create({
                    data: {
                        cuenta_origen_id: solicitud.cuenta_origen_id,
                        cuenta_destino_id: solicitud.cuenta_destino_id,
                        tipo: esTransferencia ? 'transferencia' : 'retiro',
                        monto,
                        descripcion: esTransferencia
                            ? 'Transferencia entre cuentas (solicitud)'
                            : 'Retiro de cuenta (solicitud)',
                        referencia: `SOL-${solicitudId.slice(0, 8)}`,
                        registrado_por: resueltoPor,
                    },
                });
            }
            else {
                if (saldoOrigen > 0) {
                    if (!solicitud.cuenta_destino_id) {
                        throw new ahorro_errors_1.CuentaConSaldoError();
                    }
                    await tx.cuenta.update({
                        where: { id_cuenta: solicitud.cuenta_origen_id },
                        data: {
                            saldo: { decrement: saldoOrigen },
                            saldoDisponible: { decrement: saldoOrigen },
                            totalRetiros: { increment: saldoOrigen },
                        },
                    });
                    await tx.cuenta.update({
                        where: { id_cuenta: solicitud.cuenta_destino_id },
                        data: {
                            saldo: { increment: saldoOrigen },
                            saldoDisponible: { increment: saldoOrigen },
                            totalDepositos: { increment: saldoOrigen },
                        },
                    });
                    await tx.transaccion.create({
                        data: {
                            cuenta_origen_id: solicitud.cuenta_origen_id,
                            cuenta_destino_id: solicitud.cuenta_destino_id,
                            tipo: 'transferencia',
                            monto: saldoOrigen,
                            descripcion: 'Transferencia de saldo por cierre de cuenta',
                            referencia: `SOL-${solicitudId.slice(0, 8)}`,
                            registrado_por: resueltoPor,
                        },
                    });
                }
                await tx.cuenta.update({
                    where: { id_cuenta: solicitud.cuenta_origen_id },
                    data: { estado: 'cerrada' },
                });
            }
            return tx.solicitudCuenta.update({
                where: { id_solicitud_cuenta: solicitudId },
                data: {
                    estado: 'aprobada',
                    resuelto_por: resueltoPor,
                    observaciones: observaciones ?? null,
                    fecha_resolucion: new Date(),
                },
            });
        });
        return toResumen(updated);
    }
};
exports.PrismaSolicitudCuentaRepository = PrismaSolicitudCuentaRepository;
exports.PrismaSolicitudCuentaRepository = PrismaSolicitudCuentaRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], PrismaSolicitudCuentaRepository);
//# sourceMappingURL=prisma-solicitud-cuenta.repository.js.map
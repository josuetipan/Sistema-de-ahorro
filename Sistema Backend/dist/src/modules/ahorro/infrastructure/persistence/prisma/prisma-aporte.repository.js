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
exports.PrismaAporteRepository = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../../../../shared/infrastructure/prisma/prisma.service");
const listSelect = {
    id_aporte_mensual: true,
    cuenta_id: true,
    mes: true,
    monto: true,
    meta_mensual: true,
    referencia: true,
    comprobante: true,
    archivo_nombre: true,
    descripcion: true,
    estado: true,
    fecha_registro: true,
    createdAt: true,
};
function num(value) {
    return value.toNumber();
}
function toResumen(row) {
    return {
        idAporteMensual: row.id_aporte_mensual,
        cuentaId: row.cuenta_id,
        mes: row.mes,
        monto: num(row.monto),
        metaMensual: num(row.meta_mensual),
        referencia: row.referencia,
        comprobante: row.comprobante,
        urlArchivo: row.url_archivo,
        archivoNombre: row.archivo_nombre,
        descripcion: row.descripcion,
        estado: row.estado,
        fechaRegistro: row.fecha_registro,
        createdAt: row.createdAt,
    };
}
function toListItem(row) {
    return {
        idAporteMensual: row.id_aporte_mensual,
        cuentaId: row.cuenta_id,
        mes: row.mes,
        monto: num(row.monto),
        metaMensual: num(row.meta_mensual),
        referencia: row.referencia,
        comprobante: row.comprobante,
        archivoNombre: row.archivo_nombre,
        descripcion: row.descripcion,
        estado: row.estado,
        fechaRegistro: row.fecha_registro,
        createdAt: row.createdAt,
    };
}
let PrismaAporteRepository = class PrismaAporteRepository {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async existsByCuentaAndMes(cuentaId, mes) {
        const row = await this.prisma.aporteMensual.findUnique({
            where: { cuenta_id_mes: { cuenta_id: cuentaId, mes } },
            select: { id_aporte_mensual: true },
        });
        return row !== null;
    }
    async existsByComprobante(comprobante) {
        const row = await this.prisma.aporteMensual.findUnique({
            where: { comprobante },
            select: { id_aporte_mensual: true },
        });
        return row !== null;
    }
    async create(input) {
        const row = await this.prisma.aporteMensual.create({
            data: {
                cuenta_id: input.cuentaId,
                mes: input.mes,
                monto: input.monto,
                meta_mensual: input.metaMensual,
                referencia: input.referencia ?? null,
                comprobante: input.comprobante,
                url_archivo: input.urlArchivo,
                archivo_nombre: input.archivoNombre ?? null,
                descripcion: input.descripcion ?? null,
                estado: 'pendiente',
            },
        });
        return toResumen(row);
    }
    async findById(aporteId) {
        const row = await this.prisma.aporteMensual.findUnique({
            where: { id_aporte_mensual: aporteId },
        });
        return row ? toResumen(row) : null;
    }
    async findComprobante(aporteId) {
        const row = await this.prisma.aporteMensual.findUnique({
            where: { id_aporte_mensual: aporteId },
            select: {
                id_aporte_mensual: true,
                cuenta_id: true,
                comprobante: true,
                archivo_nombre: true,
                url_archivo: true,
            },
        });
        if (!row) {
            return null;
        }
        return {
            idAporteMensual: row.id_aporte_mensual,
            cuentaId: row.cuenta_id,
            comprobante: row.comprobante,
            archivoNombre: row.archivo_nombre,
            urlArchivo: row.url_archivo,
        };
    }
    async listByCuentaAndAnio(cuentaId, anio) {
        const rows = await this.prisma.aporteMensual.findMany({
            where: { cuenta_id: cuentaId, mes: { startsWith: `${anio}-` } },
            orderBy: { mes: 'asc' },
            select: listSelect,
        });
        return rows.map(toListItem);
    }
    async listByUserId(userId, filtro) {
        const fechaRegistro = {};
        if (filtro.desde) {
            fechaRegistro.gte = filtro.desde;
        }
        if (filtro.hasta) {
            fechaRegistro.lte = filtro.hasta;
        }
        const where = {
            cuenta: { socio: { user_id: userId } },
            cuenta_id: filtro.cuentaId,
            ...(filtro.desde || filtro.hasta
                ? { fecha_registro: fechaRegistro }
                : {}),
        };
        const [rows, total] = await this.prisma.$transaction([
            this.prisma.aporteMensual.findMany({
                where,
                orderBy: { fecha_registro: 'desc' },
                skip: (filtro.page - 1) * filtro.limit,
                take: filtro.limit,
                select: listSelect,
            }),
            this.prisma.aporteMensual.count({ where }),
        ]);
        return { items: rows.map(toListItem), total };
    }
    async listAggregatesByUser(userId, mes) {
        const socioFilter = {
            cuenta: { socio: { user_id: userId } },
        };
        const [pendientes, verificadosMes] = await this.prisma.$transaction([
            this.prisma.aporteMensual.groupBy({
                by: ['cuenta_id'],
                where: { ...socioFilter, estado: 'pendiente' },
                _sum: { monto: true },
                orderBy: { cuenta_id: 'asc' },
            }),
            this.prisma.aporteMensual.groupBy({
                by: ['cuenta_id'],
                where: { ...socioFilter, estado: 'verificado', mes },
                _sum: { monto: true },
                orderBy: { cuenta_id: 'asc' },
            }),
        ]);
        const map = new Map();
        for (const row of pendientes) {
            map.set(row.cuenta_id, {
                cuentaId: row.cuenta_id,
                saldoPendiente: row._sum?.monto?.toNumber() ?? 0,
                progresoMes: 0,
            });
        }
        for (const row of verificadosMes) {
            const existing = map.get(row.cuenta_id);
            const progresoMes = row._sum?.monto?.toNumber() ?? 0;
            if (existing) {
                existing.progresoMes = progresoMes;
            }
            else {
                map.set(row.cuenta_id, {
                    cuentaId: row.cuenta_id,
                    saldoPendiente: 0,
                    progresoMes,
                });
            }
        }
        return [...map.values()];
    }
    async listForAdmin(filtro) {
        const where = {
            estado: filtro.estado,
            mes: filtro.mes,
            cuenta_id: filtro.cuentaId,
        };
        const [rows, total] = await this.prisma.$transaction([
            this.prisma.aporteMensual.findMany({
                where,
                select: {
                    ...listSelect,
                    cuenta: {
                        select: {
                            numeroCuenta: true,
                            nombre: true,
                            socio: {
                                select: {
                                    id_socio: true,
                                    codigo: true,
                                    user: { select: { full_name: true } },
                                },
                            },
                        },
                    },
                },
                orderBy: [{ fecha_registro: 'desc' }],
                skip: (filtro.page - 1) * filtro.limit,
                take: filtro.limit,
            }),
            this.prisma.aporteMensual.count({ where }),
        ]);
        const items = rows.map((row) => ({
            ...toListItem(row),
            numeroCuenta: row.cuenta.numeroCuenta,
            cuentaNombre: row.cuenta.nombre,
            socioId: row.cuenta.socio.id_socio,
            socioCodigo: row.cuenta.socio.codigo,
            socioNombre: row.cuenta.socio.user.full_name,
        }));
        return { items, total };
    }
    async cambiarEstado(aporteId, estado, observaciones, verificadoPor) {
        const aporte = await this.prisma.aporteMensual.findUnique({
            where: { id_aporte_mensual: aporteId },
        });
        if (!aporte) {
            throw new Error(`Aporte inexistente: ${aporteId}`);
        }
        const estabaVerificado = aporte.estado === 'verificado';
        const seraVerificado = estado === 'verificado';
        const updated = await this.prisma.$transaction(async (tx) => {
            const row = await tx.aporteMensual.update({
                where: { id_aporte_mensual: aporteId },
                data: {
                    estado,
                    observaciones: observaciones ?? aporte.observaciones,
                    verificado_por: verificadoPor ?? aporte.verificado_por,
                    fecha_verificacion: new Date(),
                },
            });
            if (!estabaVerificado && seraVerificado) {
                await tx.cuenta.update({
                    where: { id_cuenta: aporte.cuenta_id },
                    data: {
                        saldo: { increment: aporte.monto },
                        saldoDisponible: { increment: aporte.monto },
                        totalDepositos: { increment: aporte.monto },
                    },
                });
                await tx.transaccion.create({
                    data: {
                        cuenta_origen_id: aporte.cuenta_id,
                        tipo: 'deposito',
                        monto: aporte.monto,
                        descripcion: `Aporte mensual ${aporte.mes} verificado`,
                        referencia: `APORTE-${aporte.mes}-${aporteId.slice(0, 8)}`,
                        registrado_por: verificadoPor ?? null,
                    },
                });
            }
            else if (estabaVerificado && !seraVerificado) {
                await tx.cuenta.update({
                    where: { id_cuenta: aporte.cuenta_id },
                    data: {
                        saldo: { decrement: aporte.monto },
                        saldoDisponible: { decrement: aporte.monto },
                        totalDepositos: { decrement: aporte.monto },
                    },
                });
            }
            return row;
        });
        return toResumen(updated);
    }
};
exports.PrismaAporteRepository = PrismaAporteRepository;
exports.PrismaAporteRepository = PrismaAporteRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], PrismaAporteRepository);
//# sourceMappingURL=prisma-aporte.repository.js.map
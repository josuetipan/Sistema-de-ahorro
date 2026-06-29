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
exports.PrismaCuentaRepository = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../../../../shared/infrastructure/prisma/prisma.service");
function generarNumeroCuenta() {
    const random = Math.floor(Math.random() * 1_000_000_000)
        .toString()
        .padStart(9, '0');
    return `FNV${random}`;
}
function num(value) {
    return value.toNumber();
}
function toResumen(row) {
    const saldo = num(row.saldo);
    return {
        idCuenta: row.id_cuenta,
        numeroCuenta: row.numeroCuenta,
        nombre: row.nombre,
        tipo: row.tipo,
        estado: row.estado,
        moneda: row.moneda,
        saldo,
        saldoDisponible: num(row.saldoDisponible),
        totalAhorrado: saldo,
        totalDepositos: num(row.totalDepositos),
        totalRetiros: num(row.totalRetiros),
        color: row.color,
        icono: row.icono,
        fechaApertura: row.fechaApertura,
    };
}
let PrismaCuentaRepository = class PrismaCuentaRepository {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async socioExists(socioId) {
        const row = await this.prisma.socio.findUnique({
            where: { id_socio: socioId },
            select: { id_socio: true },
        });
        return row !== null;
    }
    async create(input) {
        let numeroCuenta = generarNumeroCuenta();
        for (let intento = 0; intento < 5; intento += 1) {
            const existe = await this.prisma.cuenta.findUnique({
                where: { numeroCuenta },
                select: { id_cuenta: true },
            });
            if (!existe) {
                break;
            }
            numeroCuenta = generarNumeroCuenta();
        }
        const row = await this.prisma.cuenta.create({
            data: {
                socio_id: input.socioId,
                numeroCuenta,
                nombre: input.nombre,
                tipo: input.tipo ?? undefined,
                moneda: input.moneda ?? undefined,
                color: input.color ?? null,
                icono: input.icono ?? null,
            },
        });
        return toResumen(row);
    }
    async listByUserId(userId) {
        const socio = await this.prisma.socio.findUnique({
            where: { user_id: userId },
            select: { id_socio: true },
        });
        if (!socio) {
            return [];
        }
        const rows = await this.prisma.cuenta.findMany({
            where: { socio_id: socio.id_socio },
            orderBy: { fechaApertura: 'asc' },
        });
        return rows.map(toResumen);
    }
    async findSocioIdByUserId(userId) {
        const socio = await this.prisma.socio.findUnique({
            where: { user_id: userId },
            select: { id_socio: true },
        });
        return socio?.id_socio ?? null;
    }
    async findOwnership(cuentaId) {
        const row = await this.prisma.cuenta.findUnique({
            where: { id_cuenta: cuentaId },
            select: {
                id_cuenta: true,
                socio_id: true,
                saldo: true,
                estado: true,
                socio: { select: { user_id: true } },
            },
        });
        if (!row) {
            return null;
        }
        return {
            idCuenta: row.id_cuenta,
            socioId: row.socio_id,
            userId: row.socio.user_id,
            saldo: num(row.saldo),
            estado: row.estado,
        };
    }
    async findResumenById(cuentaId) {
        const row = await this.prisma.cuenta.findUnique({
            where: { id_cuenta: cuentaId },
        });
        return row ? toResumen(row) : null;
    }
    async listSociosCustomer(params) {
        const where = {
            user: { role: { code_role: 'CUSTOMER' } },
        };
        const [socios, total] = await this.prisma.$transaction([
            this.prisma.socio.findMany({
                where,
                include: { user: true, cuentas: { orderBy: { fechaApertura: 'asc' } } },
                orderBy: { createdAt: 'desc' },
                skip: (params.page - 1) * params.limit,
                take: params.limit,
            }),
            this.prisma.socio.count({ where }),
        ]);
        const items = socios.map((socio) => {
            const cuentas = socio.cuentas.map(toResumen);
            const totalAhorrado = cuentas.reduce((acc, c) => acc + c.saldo, 0);
            return {
                idSocio: socio.id_socio,
                codigo: socio.codigo,
                estado: socio.estado,
                userId: socio.user_id,
                fullName: socio.user.full_name,
                email: socio.user.email,
                identification: socio.user.identification,
                phoneNumber: socio.user.phone_number,
                totalAhorrado,
                cantidadCuentas: cuentas.length,
                cuentas,
            };
        });
        return { items, total };
    }
    async getSocioCustomer(socioId) {
        const socio = await this.prisma.socio.findUnique({
            where: { id_socio: socioId },
            include: { user: true, cuentas: { orderBy: { fechaApertura: 'asc' } } },
        });
        if (!socio) {
            return null;
        }
        const cuentas = socio.cuentas.map(toResumen);
        const totalAhorrado = cuentas.reduce((acc, c) => acc + c.saldo, 0);
        return {
            idSocio: socio.id_socio,
            codigo: socio.codigo,
            estado: socio.estado,
            userId: socio.user_id,
            fullName: socio.user.full_name,
            email: socio.user.email,
            identification: socio.user.identification,
            phoneNumber: socio.user.phone_number,
            totalAhorrado,
            cantidadCuentas: cuentas.length,
            cuentas,
        };
    }
};
exports.PrismaCuentaRepository = PrismaCuentaRepository;
exports.PrismaCuentaRepository = PrismaCuentaRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], PrismaCuentaRepository);
//# sourceMappingURL=prisma-cuenta.repository.js.map
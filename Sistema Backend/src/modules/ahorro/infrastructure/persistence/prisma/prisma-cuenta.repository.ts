import { Injectable } from '@nestjs/common';
import type { Prisma } from '@prisma/client';
import { PrismaService } from '@shared/infrastructure/prisma/prisma.service';
import type {
  CrearCuentaInput,
  CuentaOwnership,
  CuentaRepositoryPort,
  CuentaResumen,
  SocioAhorroResumen,
} from '../../../domain/ports/cuenta.repository.port';

function generarNumeroCuenta(): string {
  const random = Math.floor(Math.random() * 1_000_000_000)
    .toString()
    .padStart(9, '0');
  return `FNV${random}`;
}

type CuentaRow = Prisma.CuentaGetPayload<Record<string, never>>;

function num(value: Prisma.Decimal): number {
  return value.toNumber();
}

function toResumen(row: CuentaRow): CuentaResumen {
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

@Injectable()
export class PrismaCuentaRepository implements CuentaRepositoryPort {
  constructor(private readonly prisma: PrismaService) {}

  async socioExists(socioId: string): Promise<boolean> {
    const row = await this.prisma.socio.findUnique({
      where: { id_socio: socioId },
      select: { id_socio: true },
    });
    return row !== null;
  }

  async create(input: CrearCuentaInput): Promise<CuentaResumen> {
    let numeroCuenta = generarNumeroCuenta();
    // Reintenta si hay colisión en el número generado.
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
        tipo: (input.tipo as never) ?? undefined,
        moneda: input.moneda ?? undefined,
        color: input.color ?? null,
        icono: input.icono ?? null,
      },
    });
    return toResumen(row);
  }

  async listByUserId(userId: string): Promise<CuentaResumen[]> {
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

  async findOwnership(cuentaId: string): Promise<CuentaOwnership | null> {
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

  async findResumenById(cuentaId: string): Promise<CuentaResumen | null> {
    const row = await this.prisma.cuenta.findUnique({
      where: { id_cuenta: cuentaId },
    });
    return row ? toResumen(row) : null;
  }

  async listSociosCustomer(): Promise<SocioAhorroResumen[]> {
    const socios = await this.prisma.socio.findMany({
      where: { user: { role: { code_role: 'CUSTOMER' } } },
      include: { user: true, cuentas: { orderBy: { fechaApertura: 'asc' } } },
      orderBy: { createdAt: 'desc' },
    });
    return socios.map((socio) => {
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
  }

  async getSocioCustomer(socioId: string): Promise<SocioAhorroResumen | null> {
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
}

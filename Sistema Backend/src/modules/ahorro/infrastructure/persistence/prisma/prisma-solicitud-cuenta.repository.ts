import { Injectable } from '@nestjs/common';
import type { Prisma } from '@prisma/client';
import { PrismaService } from '@shared/infrastructure/prisma/prisma.service';
import type { PageSlice } from '@shared/application/pagination';
import {
  CuentaConSaldoError,
  SaldoInsuficienteError,
} from '../../../domain/ahorro.errors';
import type {
  CrearSolicitudInput,
  ListarSolicitudesFiltro,
  SolicitudCuentaAdminItem,
  SolicitudCuentaRepositoryPort,
  SolicitudCuentaResumen,
} from '../../../domain/ports/solicitud-cuenta.repository.port';

type SolicitudRow = Prisma.SolicitudCuentaGetPayload<Record<string, never>>;

function numOrNull(value: Prisma.Decimal | null): number | null {
  return value === null ? null : value.toNumber();
}

function toResumen(row: SolicitudRow): SolicitudCuentaResumen {
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

@Injectable()
export class PrismaSolicitudCuentaRepository
  implements SolicitudCuentaRepositoryPort
{
  constructor(private readonly prisma: PrismaService) {}

  async create(input: CrearSolicitudInput): Promise<SolicitudCuentaResumen> {
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

  async findById(solicitudId: string): Promise<SolicitudCuentaResumen | null> {
    const row = await this.prisma.solicitudCuenta.findUnique({
      where: { id_solicitud_cuenta: solicitudId },
    });
    return row ? toResumen(row) : null;
  }

  async listForAdmin(
    filtro: ListarSolicitudesFiltro,
  ): Promise<PageSlice<SolicitudCuentaAdminItem>> {
    const where: Prisma.SolicitudCuentaWhereInput = {
      estado: filtro.estado,
      tipo: filtro.tipo,
    };
    const [rows, total] = await this.prisma.$transaction([
      this.prisma.solicitudCuenta.findMany({
        where,
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
        skip: (filtro.page - 1) * filtro.limit,
        take: filtro.limit,
      }),
      this.prisma.solicitudCuenta.count({ where }),
    ]);
    const items = rows.map((row) => ({
      ...toResumen(row),
      numeroCuentaOrigen: row.cuentaOrigen.numeroCuenta,
      socioId: row.cuentaOrigen.socio.id_socio,
      socioNombre: row.cuentaOrigen.socio.user.full_name,
    }));
    return { items, total };
  }

  async listByUserId(userId: string): Promise<SolicitudCuentaResumen[]> {
    const rows = await this.prisma.solicitudCuenta.findMany({
      where: { cuentaOrigen: { socio: { user_id: userId } } },
      orderBy: { createdAt: 'desc' },
    });
    return rows.map(toResumen);
  }

  async rechazar(
    solicitudId: string,
    resueltoPor: string,
    observaciones?: string | null,
  ): Promise<SolicitudCuentaResumen> {
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

  async aprobar(
    solicitudId: string,
    resueltoPor: string,
    observaciones?: string | null,
  ): Promise<SolicitudCuentaResumen> {
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
          throw new SaldoInsuficienteError();
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
            where: { id_cuenta: solicitud.cuenta_destino_id! },
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
      } else {
        // eliminacion: si hay saldo debe transferirse a la cuenta destino.
        if (saldoOrigen > 0) {
          if (!solicitud.cuenta_destino_id) {
            throw new CuentaConSaldoError();
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
}

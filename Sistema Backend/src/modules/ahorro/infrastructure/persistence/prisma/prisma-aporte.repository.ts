import { Injectable } from '@nestjs/common';
import type { EstadoAporte, Prisma } from '@prisma/client';
import { PrismaService } from '@shared/infrastructure/prisma/prisma.service';
import type {
  AporteAdminItem,
  AporteRepositoryPort,
  AporteResumen,
  CrearAporteInput,
  ListarAportesFiltro,
} from '../../../domain/ports/aporte.repository.port';

type AporteRow = Prisma.AporteMensualGetPayload<Record<string, never>>;

function num(value: Prisma.Decimal): number {
  return value.toNumber();
}

function toResumen(row: AporteRow): AporteResumen {
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

@Injectable()
export class PrismaAporteRepository implements AporteRepositoryPort {
  constructor(private readonly prisma: PrismaService) {}

  async existsByCuentaAndMes(cuentaId: string, mes: string): Promise<boolean> {
    const row = await this.prisma.aporteMensual.findUnique({
      where: { cuenta_id_mes: { cuenta_id: cuentaId, mes } },
      select: { id_aporte_mensual: true },
    });
    return row !== null;
  }

  async existsByComprobante(comprobante: string): Promise<boolean> {
    const row = await this.prisma.aporteMensual.findUnique({
      where: { comprobante },
      select: { id_aporte_mensual: true },
    });
    return row !== null;
  }

  async create(input: CrearAporteInput): Promise<AporteResumen> {
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

  async findById(aporteId: string): Promise<AporteResumen | null> {
    const row = await this.prisma.aporteMensual.findUnique({
      where: { id_aporte_mensual: aporteId },
    });
    return row ? toResumen(row) : null;
  }

  async listByCuentaAndAnio(
    cuentaId: string,
    anio: number,
  ): Promise<AporteResumen[]> {
    const rows = await this.prisma.aporteMensual.findMany({
      where: { cuenta_id: cuentaId, mes: { startsWith: `${anio}-` } },
      orderBy: { mes: 'asc' },
    });
    return rows.map(toResumen);
  }

  async listForAdmin(filtro: ListarAportesFiltro): Promise<AporteAdminItem[]> {
    const rows = await this.prisma.aporteMensual.findMany({
      where: {
        estado: filtro.estado,
        mes: filtro.mes,
        cuenta_id: filtro.cuentaId,
      },
      include: {
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
    });
    return rows.map((row) => ({
      ...toResumen(row),
      numeroCuenta: row.cuenta.numeroCuenta,
      cuentaNombre: row.cuenta.nombre,
      socioId: row.cuenta.socio.id_socio,
      socioCodigo: row.cuenta.socio.codigo,
      socioNombre: row.cuenta.socio.user.full_name,
    }));
  }

  async cambiarEstado(
    aporteId: string,
    estado: EstadoAporte,
    observaciones?: string | null,
    verificadoPor?: string | null,
  ): Promise<AporteResumen> {
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
      } else if (estabaVerificado && !seraVerificado) {
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
}

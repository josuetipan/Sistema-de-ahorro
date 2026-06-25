import { Inject, Injectable } from '@nestjs/common';
import type { TipoSolicitudCuenta } from '@prisma/client';
import type { UseCase } from '@shared/application/use-case.interface';
import {
  CuentaForbiddenError,
  CuentaNotFoundError,
  SaldoInsuficienteError,
} from '../../domain/ahorro.errors';
import {
  CUENTA_REPOSITORY,
  type CuentaRepositoryPort,
} from '../../domain/ports/cuenta.repository.port';
import {
  SOLICITUD_CUENTA_REPOSITORY,
  type SolicitudCuentaRepositoryPort,
  type SolicitudCuentaResumen,
} from '../../domain/ports/solicitud-cuenta.repository.port';

export interface CrearSolicitudCuentaInput {
  userId: string;
  cuentaOrigenId: string;
  tipo: TipoSolicitudCuenta;
  monto?: number | null;
  cuentaDestinoId?: string | null;
  motivo?: string | null;
}

@Injectable()
export class CrearSolicitudCuentaUseCase
  implements UseCase<CrearSolicitudCuentaInput, SolicitudCuentaResumen>
{
  constructor(
    @Inject(CUENTA_REPOSITORY)
    private readonly cuentas: CuentaRepositoryPort,
    @Inject(SOLICITUD_CUENTA_REPOSITORY)
    private readonly solicitudes: SolicitudCuentaRepositoryPort,
  ) {}

  async execute(
    input: CrearSolicitudCuentaInput,
  ): Promise<SolicitudCuentaResumen> {
    const origen = await this.cuentas.findOwnership(input.cuentaOrigenId);
    if (!origen) {
      throw new CuentaNotFoundError(input.cuentaOrigenId);
    }
    if (origen.userId !== input.userId) {
      throw new CuentaForbiddenError();
    }

    // La cuenta destino (si se indica) también debe pertenecer al usuario.
    if (input.cuentaDestinoId) {
      const destino = await this.cuentas.findOwnership(input.cuentaDestinoId);
      if (!destino) {
        throw new CuentaNotFoundError(input.cuentaDestinoId);
      }
      if (destino.userId !== input.userId) {
        throw new CuentaForbiddenError();
      }
    }

    if (input.tipo === 'retiro') {
      const monto = input.monto ?? 0;
      if (monto <= 0 || monto > origen.saldo) {
        throw new SaldoInsuficienteError();
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
}

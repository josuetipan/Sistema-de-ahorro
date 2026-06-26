// Entidad de dominio Transaccion
import { Dinero } from '../valueObjects/Dinero';
import { TipoTransaccionVO } from '../valueObjects/TipoTransaccion';

export class Transaccion {
  readonly id: string;
  readonly tipo: TipoTransaccionVO;
  readonly monto: Dinero;
  readonly fecha: Date;
  readonly cuentaOrigenId: string;
  readonly cuentaDestinoId?: string;

  constructor(
    id: string,
    tipo: TipoTransaccionVO,
    monto: Dinero,
    cuentaOrigenId: string,
    cuentaDestinoId?: string,
    fecha = new Date(),
  ) {
    this.id = id;
    this.tipo = tipo;
    this.monto = monto;
    this.cuentaOrigenId = cuentaOrigenId;
    this.cuentaDestinoId = cuentaDestinoId;
    this.fecha = fecha;
  }
}

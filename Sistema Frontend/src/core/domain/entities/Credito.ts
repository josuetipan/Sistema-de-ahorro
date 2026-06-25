// Entidad de dominio Crédito con validación de montos y plazos
import { Dinero } from '../valueObjects/Dinero';
import { EstadoCreditoVO } from '../valueObjects/EstadoCredito';
import { ValidationError } from '../errors/ValidationError';

export class Credito {
  readonly id: string;
  readonly monto: Dinero;
  readonly plazoMeses: number;
  private estado: EstadoCreditoVO;

  constructor(id: string, monto: Dinero, plazoMeses: number, estado = EstadoCreditoVO.PENDIENTE) {
    if (plazoMeses < 1 || plazoMeses > 360) {
      throw new ValidationError('Plazo inválido');
    }
    this.id = id;
    this.monto = monto;
    this.plazoMeses = plazoMeses;
    this.estado = estado;
  }

  getEstado(): EstadoCreditoVO {
    return this.estado;
  }

  aprobar(): void {
    if (this.estado !== EstadoCreditoVO.PENDIENTE) {
      throw new ValidationError('Solo créditos pendientes pueden aprobarse');
    }
    this.estado = EstadoCreditoVO.APROBADO;
  }
}

// Value object inmutable para representar monto y moneda
import { ValidationError } from '../errors/ValidationError';

export class Dinero {
  readonly monto: number;
  readonly moneda: string;

  constructor(monto: number, moneda: string) {
    if (monto < 0) {
      throw new ValidationError('El monto no puede ser negativo');
    }
    if (!moneda || moneda.length !== 3) {
      throw new ValidationError('La moneda debe ser un código ISO de 3 letras');
    }
    this.monto = monto;
    this.moneda = moneda.toUpperCase();
    Object.freeze(this);
  }

  private assertMismaMoneda(otro: Dinero): void {
    if (this.moneda !== otro.moneda) {
      throw new ValidationError('No se pueden operar montos con monedas distintas');
    }
  }

  sumar(otro: Dinero): Dinero {
    this.assertMismaMoneda(otro);
    return new Dinero(this.monto + otro.monto, this.moneda);
  }

  restar(otro: Dinero): Dinero {
    this.assertMismaMoneda(otro);
    const resultado = this.monto - otro.monto;
    if (resultado < 0) {
      throw new ValidationError('El resultado no puede ser negativo');
    }
    return new Dinero(resultado, this.moneda);
  }

  equals(otro: Dinero): boolean {
    return this.monto === otro.monto && this.moneda === otro.moneda;
  }
}

// Entidad de dominio Cuenta con operaciones de saldo
import { Dinero } from '../valueObjects/Dinero';
import { ValidationError } from '../errors/ValidationError';

export class Cuenta {
  readonly id: string;
  readonly numero: string;
  private saldo: Dinero;
  readonly activa: boolean;

  constructor(id: string, numero: string, saldo: Dinero, activa = true) {
    this.id = id;
    this.numero = numero;
    this.saldo = saldo;
    this.activa = activa;
  }

  getSaldo(): Dinero {
    return this.saldo;
  }

  depositar(monto: Dinero): void {
    if (!this.activa) throw new ValidationError('La cuenta no está activa');
    this.saldo = this.saldo.sumar(monto);
  }

  retirar(monto: Dinero): void {
    if (!this.activa) throw new ValidationError('La cuenta no está activa');
    this.saldo = this.saldo.restar(monto);
  }
}

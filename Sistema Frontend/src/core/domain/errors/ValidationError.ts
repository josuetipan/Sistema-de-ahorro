// Error de validación de reglas de negocio del dominio
import { DomainError } from './DomainError';

export class ValidationError extends DomainError {
  constructor(message: string) {
    super(message);
    this.name = 'ValidationError';
  }
}

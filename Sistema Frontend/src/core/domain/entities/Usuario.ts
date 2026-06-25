// Entidad de dominio Usuario con reglas de negocio
import { ValidationError } from '../errors/ValidationError';

export interface UsuarioProps {
  id: string;
  email: string;
  nombre: string;
  rol: string;
  activo: boolean;
}

export class Usuario {
  readonly id: string;
  readonly email: string;
  readonly nombre: string;
  readonly rol: string;
  private _activo: boolean;

  constructor(props: UsuarioProps) {
    if (!props.email.includes('@')) {
      throw new ValidationError('Email inválido');
    }
    this.id = props.id;
    this.email = props.email;
    this.nombre = props.nombre;
    this.rol = props.rol;
    this._activo = props.activo;
  }

  get activo(): boolean {
    return this._activo;
  }

  desactivar(): void {
    this._activo = false;
  }

  puedeSolicitarCredito(): boolean {
    return this._activo && this.rol === 'cliente';
  }
}

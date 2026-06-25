import type { ISocioRepository } from '../../domain/socio.repository';
import type {
  ActualizarSocioInput,
  CrearSocioInput,
  CuentaAhorroSocio,
  RegistroPublicoSocioInput,
  Socio,
} from '../../domain/socio.entity';
import {
  generarCodigoReferenciaUnico,
  validarCodigoReferencia,
} from '../../domain/socio.rules';
import { MOCK_SOCIOS_DATA } from '../data/socios.mock';

function clonarSocios(socios: Socio[]): Socio[] {
  return socios.map((socio) => ({
    ...socio,
    cuentas: socio.cuentas.map((cuenta) => ({ ...cuenta })),
  }));
}

function construirSocio(
  socios: Socio[],
  input: CrearSocioInput,
  referidor?: Socio,
): Socio {
  return {
    id: `soc-${Date.now()}`,
    codigoReferencia: generarCodigoReferenciaUnico(socios),
    nombres: input.nombres.trim(),
    cedula: input.cedula.trim(),
    email: input.email.trim().toLowerCase(),
    telefono: input.telefono.trim(),
    estado: 'pendiente',
    fechaAlta: new Date().toISOString().slice(0, 10),
    referidoPorId: referidor?.id,
    referidoPor: referidor?.codigoReferencia,
    cuentas: [],
  };
}

export class SocioMockAdapter implements ISocioRepository {
  private socios: Socio[];

  constructor(initialData: Socio[] = MOCK_SOCIOS_DATA) {
    this.socios = clonarSocios(initialData);
  }

  async listar(): Promise<Socio[]> {
    return clonarSocios(this.socios);
  }

  async buscar(termino: string): Promise<Socio[]> {
    const q = termino.trim().toLowerCase();
    if (!q) return [];
    return clonarSocios(
      this.socios.filter(
        (s) =>
          s.cedula.includes(q) ||
          s.codigoReferencia.toLowerCase() === q.toUpperCase() ||
          s.nombres.toLowerCase().includes(q),
      ),
    );
  }

  async crear(input: CrearSocioInput): Promise<Socio> {
    const codigo = input.codigoReferenciaIngresado?.trim() ?? '';
    const validacion = validarCodigoReferencia(codigo, this.socios);
    if (!validacion.valido) {
      throw new Error(validacion.error ?? 'Código de referencia inválido.');
    }

    this.validarDuplicados(input.email, input.cedula);

    const nuevo = construirSocio(this.socios, input, validacion.socioReferidor);
    this.socios = [...this.socios, nuevo];
    return { ...nuevo, cuentas: [] };
  }

  async registrarPublico(input: RegistroPublicoSocioInput): Promise<Socio> {
    const validacion = validarCodigoReferencia(input.codigoReferenciaIngresado, this.socios, {
      obligatorio: true,
    });
    if (!validacion.valido) {
      throw new Error(validacion.error ?? 'Código de referencia inválido.');
    }

    this.validarDuplicados(input.email, input.cedula);

    const nuevo = construirSocio(this.socios, input, validacion.socioReferidor);
    this.socios = [...this.socios, nuevo];
    return { ...nuevo, cuentas: [] };
  }

  async actualizar(id: string, input: ActualizarSocioInput): Promise<Socio> {
    const indice = this.socios.findIndex((s) => s.id === id);
    if (indice === -1) {
      throw new Error('Socio no encontrado.');
    }

    const actualizado: Socio = {
      ...this.socios[indice],
      nombres: input.nombres.trim(),
      cedula: input.cedula.trim(),
      email: input.email.trim().toLowerCase(),
      telefono: input.telefono.trim(),
    };

    this.socios = this.socios.map((s, i) => (i === indice ? actualizado : s));
    return { ...actualizado, cuentas: actualizado.cuentas.map((c) => ({ ...c })) };
  }

  async cambiarEstado(id: string, activo: boolean): Promise<Socio> {
    const socio = this.socios.find((s) => s.id === id);
    if (!socio) {
      throw new Error('Socio no encontrado.');
    }

    const actualizado: Socio = { ...socio, estado: activo ? 'activo' : 'inactivo' };
    this.socios = this.socios.map((s) => (s.id === id ? actualizado : s));
    return { ...actualizado, cuentas: actualizado.cuentas.map((c) => ({ ...c })) };
  }

  async agregarCuenta(socioId: string, cuenta: CuentaAhorroSocio): Promise<Socio> {
    const indice = this.socios.findIndex((s) => s.id === socioId);
    if (indice === -1) {
      throw new Error('Socio no encontrado.');
    }

    const actualizado: Socio = {
      ...this.socios[indice],
      cuentas: [...this.socios[indice].cuentas, cuenta],
    };

    this.socios = this.socios.map((s, i) => (i === indice ? actualizado : s));
    return { ...actualizado, cuentas: actualizado.cuentas.map((c) => ({ ...c })) };
  }

  validarCodigoReferencia(
    codigo: string,
    opciones?: { excluirSocioId?: string; obligatorio?: boolean },
  ) {
    return validarCodigoReferencia(codigo, this.socios, opciones);
  }

  private validarDuplicados(email: string, cedula: string) {
    const emailNorm = email.trim().toLowerCase();
    const cedulaNorm = cedula.trim();
    if (this.socios.some((s) => s.email === emailNorm)) {
      throw new Error('Ya existe un socio registrado con ese correo.');
    }
    if (this.socios.some((s) => s.cedula === cedulaNorm)) {
      throw new Error('Ya existe un socio registrado con esa cédula.');
    }
  }
}

export const socioMockRepository = new SocioMockAdapter();

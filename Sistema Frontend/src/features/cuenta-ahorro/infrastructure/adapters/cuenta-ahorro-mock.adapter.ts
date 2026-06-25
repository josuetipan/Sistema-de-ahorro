import type { CuentaAhorroSocio, Socio } from '@features/socio/domain/socio.entity';
import type { ISocioRepository } from '@features/socio/domain/socio.repository';
import { socioMockRepository } from '@features/socio/infrastructure/adapters/socio-mock.adapter';
import type { ICuentaAhorroRepository } from '../../domain/cuenta-ahorro.repository';
import type {
  CrearCuentaAhorroInput,
  CuentaAhorroPublica,
  EmailSimulado,
  ResultadoCreacionCuenta,
  SocioResumen,
} from '../../domain/cuenta-ahorro.entity';
import {
  construirCuerpoEmailEnmascarado,
  generarClaveUnica,
  generarNumeroCuentaUnico,
  generarUsuarioUnico,
  normalizarBusqueda,
} from '../../domain/cuenta-ahorro.rules';

interface CredencialesInternas {
  usuario: string;
  clave: string;
}

export class CuentaAhorroMockAdapter implements ICuentaAhorroRepository {
  /** Credenciales sensibles — nunca expuestas fuera del adaptador */
  private credenciales = new Map<string, CredencialesInternas>();
  private emailsSimulados: EmailSimulado[] = [];

  constructor(private socioRepo: ISocioRepository = socioMockRepository) {}

  async listarCuentas(): Promise<CuentaAhorroPublica[]> {
    const socios = await this.socioRepo.listar();
    return socios.flatMap((s) => s.cuentas.map((c) => this.toPublica(c, s)));
  }

  async listarCuentasPorSocio(socioId: string): Promise<CuentaAhorroPublica[]> {
    const socios = await this.socioRepo.listar();
    const socio = socios.find((s) => s.id === socioId);
    if (!socio) return [];
    return socio.cuentas.map((c) => this.toPublica(c, socio));
  }

  async buscarSocios(termino: string): Promise<SocioResumen[]> {
    const q = normalizarBusqueda(termino).toLowerCase();
    if (!q) return [];

    const socios = await this.socioRepo.listar();
    return socios
      .filter(
        (s) =>
          s.cedula.includes(q) ||
          s.codigoReferencia.toLowerCase() === q.toUpperCase() ||
          s.nombres.toLowerCase().includes(q),
      )
      .map((s) => this.toSocioResumen(s));
  }

  async crearCuenta(input: CrearCuentaAhorroInput): Promise<ResultadoCreacionCuenta> {
    let socio = await this.resolverSocio(input);

    if (input.modo === 'con_referencia' && !input.socioId && !input.codigoReferenciaBusqueda) {
      throw new Error('Debes buscar un socio por cédula o código de referencia.');
    }

    const sets = await this.obtenerSetsUnicos();
    const numeroCuenta = generarNumeroCuentaUnico(sets.numeros);
    const usuario = generarUsuarioUnico(sets.usuarios);
    const clave = generarClaveUnica(sets.claves);

    const codigoReferenciaCuenta =
      input.modo === 'con_referencia' ? socio.codigoReferencia : null;

    const nuevaCuenta: CuentaAhorroSocio = {
      id: `cta-${Date.now()}`,
      numeroCuenta,
      correo: input.correo.trim().toLowerCase(),
      codigoReferencia: codigoReferenciaCuenta,
      saldo: 0,
      estado: 'ACTIVA',
      fechaApertura: new Date().toISOString().slice(0, 10),
    };

    socio = await this.socioRepo.agregarCuenta(socio.id, nuevaCuenta);
    this.credenciales.set(nuevaCuenta.id, { usuario, clave });

    const emailSimulado: EmailSimulado = {
      id: `email-${Date.now()}`,
      cuentaId: nuevaCuenta.id,
      to: input.correo.trim().toLowerCase(),
      subject: 'Credenciales de acceso - Sistema de Ahorro',
      body: construirCuerpoEmailEnmascarado(numeroCuenta),
      sentAt: new Date().toISOString(),
    };

    this.emailsSimulados = [emailSimulado, ...this.emailsSimulados];

    return {
      cuenta: this.toPublica(nuevaCuenta, socio),
      emailSimulado,
    };
  }

  async listarEmailsSimulados(): Promise<EmailSimulado[]> {
    return [...this.emailsSimulados];
  }

  private async resolverSocio(input: CrearCuentaAhorroInput): Promise<Socio> {
    const socios = await this.socioRepo.listar();

    if (input.socioId) {
      const encontrado = socios.find((s) => s.id === input.socioId);
      if (!encontrado) throw new Error('Socio no encontrado.');
      return encontrado;
    }

    const busqueda = normalizarBusqueda(input.codigoReferenciaBusqueda ?? input.cedula);
    if (busqueda) {
      const porCedula = socios.find((s) => s.cedula === busqueda);
      if (porCedula) return porCedula;

      const porCodigo = socios.find(
        (s) => s.codigoReferencia.toUpperCase() === busqueda.toUpperCase(),
      );
      if (porCodigo) return porCodigo;
    }

    if (input.modo === 'con_referencia') {
      throw new Error('No se encontró un socio con esa cédula o código de referencia.');
    }

    const existenteCedula = socios.find((s) => s.cedula === input.cedula.trim());
    if (existenteCedula) return existenteCedula;

    return this.socioRepo.crear({
      nombres: input.nombres,
      cedula: input.cedula,
      email: input.correo,
      telefono: input.telefono,
    });
  }

  private async obtenerSetsUnicos() {
    const socios = await this.socioRepo.listar();
    const numeros = new Set(socios.flatMap((s) => s.cuentas.map((c) => c.numeroCuenta)));
    const creds = Array.from(this.credenciales.values());
    const usuarios = new Set(creds.map((c) => c.usuario));
    const claves = new Set(creds.map((c) => c.clave));
    return { numeros, usuarios, claves };
  }

  private toPublica(cuenta: CuentaAhorroSocio, socio: Socio): CuentaAhorroPublica {
    return {
      id: cuenta.id,
      socioId: socio.id,
      socioNombre: socio.nombres,
      numeroCuenta: cuenta.numeroCuenta,
      correo: cuenta.correo ?? socio.email,
      codigoReferencia: cuenta.codigoReferencia ?? null,
      saldo: cuenta.saldo,
      estado: cuenta.estado,
      fechaApertura: cuenta.fechaApertura,
    };
  }

  private toSocioResumen(socio: Socio): SocioResumen {
    return {
      id: socio.id,
      nombres: socio.nombres,
      cedula: socio.cedula,
      email: socio.email,
      telefono: socio.telefono,
      codigoReferencia: socio.codigoReferencia,
      referidoPor: socio.referidoPor,
    };
  }
}

export const cuentaAhorroMockRepository = new CuentaAhorroMockAdapter();

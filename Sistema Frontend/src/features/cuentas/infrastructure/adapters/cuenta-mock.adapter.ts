import type { ICuentaRepository } from '../../domain/cuenta.repository';
import type {
  Aporte,
  AportesPage,
  CalendarioAhorro,
  CrearCuentaInput,
  CuentaCreada,
  Invitacion,
  ListarAportesParams,
  RegistrarAporteInput,
  ResumenAhorroGlobal,
} from '../../domain/cuenta.entity';
import { MOCK_CUENTAS_USUARIO } from '@shared/data/ahorroMockData';

const delay = (ms = 400) => new Promise((resolve) => setTimeout(resolve, ms));

export class CuentaMockAdapter implements ICuentaRepository {
  async obtenerResumen(): Promise<ResumenAhorroGlobal> {
    await delay();
    return {
      mesActual: new Date().toISOString().slice(0, 7),
      metaMensual: 25,
      metaMinima: 25,
      metaMaxima: 1000,
      totalAhorradoGlobal: 0,
      saldoDisponibleGlobal: 0,
      saldoPendienteGlobal: 0,
      progresoMesGlobal: 0,
      cantidadCuentas: MOCK_CUENTAS_USUARIO.length,
      cuentas: MOCK_CUENTAS_USUARIO.map((c) => ({
        cuentaId: c.id,
        numeroCuenta: c.numeroCuenta,
        nombre: c.nombre,
        estado: c.estado,
        saldo: c.saldo,
        saldoDisponible: c.saldo,
        saldoPendiente: 0,
        progresoMes: 0,
        metaMensual: c.metaMensual,
        metaCumplida: false,
      })),
    };
  }

  async crearCuenta(input: CrearCuentaInput): Promise<CuentaCreada> {
    await delay();
    const id = `cta-${Date.now()}`;
    return {
      idCuenta: id,
      numeroCuenta: `FNV${String(Math.floor(Math.random() * 900000000) + 100000000)}`,
      nombre: input.nombre,
      tipo: input.tipo,
      estado: 'activa',
      moneda: input.moneda,
      saldo: 0,
      saldoDisponible: 0,
      totalAhorrado: 0,
      color: input.color,
      icono: input.icono,
      fechaApertura: new Date().toISOString(),
      socioId: 'mock-socio',
      titular: 'Usuario Demo',
    };
  }

  async listarAportes(params: ListarAportesParams): Promise<AportesPage> {
    await delay();
    return {
      data: [],
      page: params.page ?? 1,
      limit: params.limit ?? 10,
      total: 0,
      totalPages: 0,
    };
  }

  async registrarAporte(input: RegistrarAporteInput): Promise<Aporte> {
    await delay();
    return {
      id: `aporte-${Date.now()}`,
      cuentaId: input.cuentaId,
      mes: input.mes,
      monto: input.monto,
      estado: 'pendiente',
      fechaRegistro: new Date().toISOString(),
      descripcion: input.descripcion,
      comprobante: input.comprobante,
    };
  }

  async obtenerCalendario(cuentaId: string, anio: number): Promise<CalendarioAhorro> {
    await delay();
    return {
      cuentaId,
      numeroCuenta: '',
      nombre: '',
      anio,
      totalAhorrado: 0,
      mesesCumplidos: 0,
      metaMensual: 0,
      metaMinima: 0,
      metaMaxima: 0,
      meses: Array.from({ length: 12 }, (_, i) => ({
        mes: `${anio}-${String(i + 1).padStart(2, '0')}`,
        numeroMes: i + 1,
        metaMensual: 0,
        metaMinima: 0,
        metaMaxima: 0,
        montoAportado: 0,
        estado: 'sin_registro',
        cumplido: false,
        aporteId: null,
        comprobante: null,
      })),
    };
  }

  async obtenerMiInvitacion(): Promise<Invitacion> {
    await delay();
    return {
      idInvitacion: 'mock-invitacion',
      codigo: 'AHORRO-DEMO-000000',
      activo: true,
      createdAt: new Date().toISOString(),
      titular: 'Usuario Demo',
      socioCodigo: 'SOC-DEMO',
    };
  }
}

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
} from './cuenta.entity';

export interface ICuentaRepository {
  obtenerResumen(): Promise<ResumenAhorroGlobal>;
  crearCuenta(input: CrearCuentaInput): Promise<CuentaCreada>;
  listarAportes(params: ListarAportesParams): Promise<AportesPage>;
  registrarAporte(input: RegistrarAporteInput): Promise<Aporte>;
  obtenerCalendario(cuentaId: string, anio: number): Promise<CalendarioAhorro>;
  obtenerMiInvitacion(): Promise<Invitacion>;
}

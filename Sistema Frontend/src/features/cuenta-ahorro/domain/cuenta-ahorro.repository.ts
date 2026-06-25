import type {
  CrearCuentaAhorroInput,
  CuentaAhorroPublica,
  EmailSimulado,
  ResultadoCreacionCuenta,
  SocioResumen,
} from './cuenta-ahorro.entity';

export interface ICuentaAhorroRepository {
  listarCuentas(): Promise<CuentaAhorroPublica[]>;
  listarCuentasPorSocio(socioId: string): Promise<CuentaAhorroPublica[]>;
  buscarSocios(termino: string): Promise<SocioResumen[]>;
  crearCuenta(input: CrearCuentaAhorroInput): Promise<ResultadoCreacionCuenta>;
  listarEmailsSimulados(): Promise<EmailSimulado[]>;
}

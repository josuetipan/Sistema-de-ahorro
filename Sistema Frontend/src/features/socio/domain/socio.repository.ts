import type {
  ActualizarSocioInput,
  CrearSocioInput,
  CuentaAhorroSocio,
  RegistroPublicoSocioInput,
  Socio,
  ValidacionCodigoReferencia,
} from './socio.entity';

export interface ISocioRepository {
  listar(): Promise<Socio[]>;
  buscar(termino: string): Promise<Socio[]>;
  crear(input: CrearSocioInput): Promise<Socio>;
  registrarPublico(input: RegistroPublicoSocioInput): Promise<Socio>;
  actualizar(id: string, input: ActualizarSocioInput): Promise<Socio>;
  cambiarEstado(id: string, activo: boolean): Promise<Socio>;
  agregarCuenta(socioId: string, cuenta: CuentaAhorroSocio): Promise<Socio>;
  validarCodigoReferencia(
    codigo: string,
    opciones?: { excluirSocioId?: string; obligatorio?: boolean },
  ): ValidacionCodigoReferencia;
}

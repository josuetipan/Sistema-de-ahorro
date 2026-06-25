export type {
  Socio,
  CuentaAhorroSocio,
  CrearSocioInput,
  RegistroPublicoSocioInput,
  ActualizarSocioInput,
  EstadoSocio,
  EstadoCuentaAhorro,
  ValidacionCodigoReferencia,
} from './domain/socio.entity';

export type { ISocioRepository } from './domain/socio.repository';

export {
  generarCodigoReferencia,
  generarCodigoReferenciaUnico,
  generarNumeroCuenta,
  validarCodigoReferencia,
  obtenerCodigosReferenciaValidos,
  calcularSaldoTotal,
  obtenerNombreReferidor,
  obtenerCodigoReferidor,
} from './domain/socio.rules';

export {
  MOCK_SOCIOS_DATA,
  CODIGOS_REFERENCIA_VALIDOS,
} from './infrastructure/data/socios.mock';
export { SocioMockAdapter, socioMockRepository } from './infrastructure/adapters/socio-mock.adapter';

export { useSocios } from './application/hooks/useSocios';
export { registrarSocioPublicoUseCase } from './application/use-cases/registrar-socio-publico.usecase';
export {
  registroPublicoSocioSchema,
  crearSocioAdminSchema,
  type RegistroPublicoSocioFormData,
  type CrearSocioAdminFormData,
} from './application/schemas/registro-socio.schema';

export { SocioRegisterForm } from './presentation/components/SocioRegisterForm';
export { AdminCreateSocioForm } from './presentation/components/AdminCreateSocioForm';
export { SocioCard } from './presentation/components/SocioCard';
export { SocioPerfilDetalle } from './presentation/components/SocioPerfilDetalle';
export { CuentaAhorroList } from './presentation/components/CuentaAhorroList';
export { CuentaAhorroItem } from './presentation/components/CuentaAhorroItem';

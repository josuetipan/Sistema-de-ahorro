export type {
  CuentaAhorroPublica,
  EmailSimulado,
  CrearCuentaAhorroInput,
  ModoCreacionCuenta,
  SocioResumen,
  ResultadoCreacionCuenta,
} from './domain/cuenta-ahorro.entity';

export type { ICuentaAhorroRepository } from './domain/cuenta-ahorro.repository';

export { useCuentasAhorroAdmin } from './application/hooks/useCuentasAhorroAdmin';
export { cuentaAhorroMockRepository } from './infrastructure/adapters/cuenta-ahorro-mock.adapter';

export { SocioSearch } from './presentation/components/SocioSearch';
export { SocioSelector } from './presentation/components/SocioSelector';
export { CreateAccountForm } from './presentation/components/CreateAccountForm';
export { AccountList } from './presentation/components/AccountList';
export { AccountCard } from './presentation/components/AccountCard';
export { EmailSimulationModal } from './presentation/components/EmailSimulationModal';
export { AdminCrearCuentaPanel } from './presentation/views/AdminCrearCuentaPanel';

export { MisAhorrosView } from './presentation/views/MisAhorrosView';
export { SocioCard } from './presentation/components/SocioCard';
export { PaymentList } from './presentation/components/PaymentList';
export { PaymentUpload } from './presentation/components/PaymentUpload';
export { AdminVerificationPanel } from './presentation/components/AdminVerificationPanel';
export { PaymentVerificationCard } from './presentation/components/PaymentVerificationCard';
export { ReceiptViewerButton } from './presentation/components/receipt/ReceiptViewerButton';
export { ReceiptModal } from './presentation/components/receipt/ReceiptModal';
export { MetaAhorroIndicador } from './presentation/components/MetaAhorroIndicador';
export { CalendarioMetaCard } from './presentation/components/CalendarioMetaCard';
export { usePagosAhorro } from './application/hooks/usePagosAhorro';
export {
  META_MENSUAL_OBLIGATORIA,
  type PagoAhorro,
  type EstadoPagoAhorro,
  type ResumenAhorro,
} from './domain/pago.entity';
export {
  calcularResumenAhorro,
  buildCalendarioAnualFromPagos,
  LABEL_ESTADO_MES,
  estadoMesToBadge,
  type MesCalendario,
} from './domain/pago.rules';
export { pagoAhorroMockRepository } from './infrastructure/adapters/pago-ahorro-mock.adapter';

import type { PagoAhorro } from './pago.entity';

export type ReceiptFileType = 'image' | 'pdf' | 'unknown';

const IMAGE_EXT = /\.(jpe?g|png|webp|gif)$/i;
const PDF_EXT = /\.pdf$/i;

export interface ReceiptViewData {
  socioNombre: string;
  numeroCuenta: string;
  monto: number;
  fecha: string;
  archivoNombre: string;
  comprobanteUrl: string;
}

export function inferReceiptFileType(source: string): ReceiptFileType {
  if (PDF_EXT.test(source)) return 'pdf';
  if (IMAGE_EXT.test(source)) return 'image';
  return 'unknown';
}

export function resolveComprobanteUrl(
  pago: Pick<PagoAhorro, 'comprobanteUrl' | 'archivoNombre'>,
): string | null {
  if (pago.comprobanteUrl) return pago.comprobanteUrl;
  if (!pago.archivoNombre) return null;
  return `/mock/${pago.archivoNombre}`;
}

export function toReceiptViewData(pago: PagoAhorro): ReceiptViewData | null {
  const comprobanteUrl = resolveComprobanteUrl(pago);
  if (!comprobanteUrl) return null;

  return {
    socioNombre: pago.socioNombre,
    numeroCuenta: pago.numeroCuenta,
    monto: pago.monto,
    fecha: pago.fecha,
    archivoNombre: pago.archivoNombre ?? 'comprobante',
    comprobanteUrl,
  };
}

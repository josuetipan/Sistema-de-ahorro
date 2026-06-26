import { Modal } from '@shared/ui/molecules/Modal';
import { formatCurrency, formatDate } from '@shared/lib/formatters';
import type { ReceiptViewData } from '../../../domain/receipt.utils';
import { inferReceiptFileType } from '../../../domain/receipt.utils';
import { ImagePreview } from './ImagePreview';
import { PDFViewer } from './PDFViewer';

interface ReceiptModalProps {
  receipt: ReceiptViewData | null;
  onClose: () => void;
}

export function ReceiptModal({ receipt, onClose }: ReceiptModalProps) {
  if (!receipt) return null;

  const fileType = inferReceiptFileType(receipt.archivoNombre || receipt.comprobanteUrl);

  return (
    <Modal isOpen={!!receipt} onClose={onClose} title="Comprobante de pago" size="lg">
      <div className="space-y-4">
        <dl className="grid gap-2 rounded-lg border border-slate-100 bg-slate-50 p-3 text-sm sm:grid-cols-2">
          <div>
            <dt className="text-xs text-slate-500">Socio</dt>
            <dd className="font-medium text-slate-900">{receipt.socioNombre}</dd>
          </div>
          <div>
            <dt className="text-xs text-slate-500">Número de cuenta</dt>
            <dd className="font-mono text-slate-900">{receipt.numeroCuenta}</dd>
          </div>
          <div>
            <dt className="text-xs text-slate-500">Monto</dt>
            <dd className="font-semibold tabular-nums text-slate-900">
              {formatCurrency(receipt.monto)}
            </dd>
          </div>
          <div>
            <dt className="text-xs text-slate-500">Fecha del pago</dt>
            <dd>{formatDate(receipt.fecha)}</dd>
          </div>
          <div className="sm:col-span-2">
            <dt className="text-xs text-slate-500">Archivo</dt>
            <dd className="font-mono text-xs text-slate-700">{receipt.archivoNombre}</dd>
          </div>
        </dl>

        {fileType === 'image' && (
          <ImagePreview src={receipt.comprobanteUrl} alt={receipt.archivoNombre} />
        )}
        {fileType === 'pdf' && (
          <PDFViewer src={receipt.comprobanteUrl} title={receipt.archivoNombre} />
        )}
        {fileType === 'unknown' && (
          <p className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-4 text-center text-sm text-amber-800">
            Formato no soportado para vista previa.
          </p>
        )}
      </div>
    </Modal>
  );
}

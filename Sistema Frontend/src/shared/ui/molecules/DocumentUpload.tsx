import { useRef, type ChangeEvent } from 'react';
import { ActionButton } from '@shared/ui/atoms/ActionButton';
import { NavIcon } from '@shared/ui/atoms/NavIcon';
import { formatFileSize } from '@shared/lib/formatters';

export interface UploadedDocument {
  id: string;
  name: string;
  size?: number;
}

export interface DocumentUploadProps {
  /** id del input oculto (usado por FormField htmlFor) */
  id?: string;
  accept?: string;
  multiple?: boolean;
  disabled?: boolean;
  buttonLabel?: string;
  hint?: string;
  emptyLabel?: string;
  documents: UploadedDocument[];
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onRemove?: (documentId: string) => void;
  onView?: (document: UploadedDocument) => void;
  className?: string;
}

export function createDocumentEntry(file: File): UploadedDocument {
  return {
    id: `file-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    name: file.name,
    size: file.size,
  };
}

export function DocumentUpload({
  id = 'file-upload',
  accept = '.pdf,.jpg,.jpeg,.png',
  multiple = false,
  disabled = false,
  buttonLabel,
  hint = 'PDF, JPG o PNG · máximo recomendado 10 MB',
  emptyLabel = 'Sin archivos seleccionados',
  documents,
  onChange,
  onRemove,
  onView,
  className = '',
}: DocumentUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const label = buttonLabel ?? (multiple ? 'Subir documentos' : 'Seleccionar archivo');

  const openPicker = () => {
    if (disabled) return;
    inputRef.current?.click();
  };

  return (
    <div className={`flex flex-col gap-5 ${className}`}>
      <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50/80 px-5 py-8 text-center motion-safe-transition hover:border-blue-200 hover:bg-blue-50/30 sm:px-8 sm:py-10">
        <span className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-blue-600 shadow-sm ring-1 ring-gray-100">
          <NavIcon name="upload" size={26} />
        </span>
        <p className="text-sm font-medium text-gray-900">Arrastra archivos aquí o selecciónalos</p>
        <p className="mt-1 max-w-sm text-pretty text-xs text-gray-500">{hint}</p>
        <ActionButton
          type="button"
          variant="outline"
          className="mt-5"
          disabled={disabled}
          icon={<NavIcon name="file" size={16} />}
          onClick={openPicker}
        >
          {label}
        </ActionButton>
        <input
          ref={inputRef}
          id={id}
          name={id}
          type="file"
          accept={accept}
          multiple={multiple}
          disabled={disabled}
          className="sr-only"
          onChange={onChange}
        />
      </div>

      <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-[0_1px_2px_rgba(15,23,42,0.04)] sm:p-5">
        <div className="mb-3 flex items-center justify-between gap-3">
          <p className="text-sm font-semibold text-gray-900">Documentos cargados</p>
          <span className="rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium tabular-nums text-gray-600">
            {documents.length}
          </span>
        </div>

        {documents.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-gray-100 bg-gray-50/60 px-4 py-8 text-center">
            <NavIcon name="file" size={22} className="text-gray-300" />
            <p className="text-sm text-gray-500">{emptyLabel}</p>
          </div>
        ) : (
          <ul className="divide-y divide-gray-100">
            {documents.map((doc) => (
              <li
                key={doc.id}
                className="flex flex-col gap-3 py-3 first:pt-0 last:pb-0 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="flex min-w-0 items-start gap-3 sm:items-center">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600 ring-1 ring-blue-100">
                    <NavIcon name="file" size={18} />
                  </span>
                  <div className="min-w-0 text-left">
                    <p className="truncate text-sm font-medium text-gray-900">{doc.name}</p>
                    <p className="mt-0.5 text-xs text-gray-500">{formatFileSize(doc.size)}</p>
                  </div>
                </div>
                <div className="flex shrink-0 items-center gap-2 sm:justify-end">
                  {onView && (
                    <ActionButton type="button" variant="ghost" size="sm" onClick={() => onView(doc)}>
                      Ver
                    </ActionButton>
                  )}
                  {onRemove && (
                    <ActionButton
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => onRemove(doc.id)}
                    >
                      Eliminar
                    </ActionButton>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

import { useState } from 'react';
import { ActionButton } from '@shared/ui/atoms/ActionButton';
import { Input } from '@shared/ui/atoms/Input';
import { NavIcon } from '@shared/ui/atoms/NavIcon';
import { Select } from '@shared/ui/atoms/Select';
import { TextArea } from '@shared/ui/atoms/TextArea';
import { Modal } from '@shared/ui/molecules/Modal';
import { StatusBadge } from '@shared/ui/molecules/StatusBadge';
import { Table, type TableColumn } from '@shared/ui/molecules/Table';
import { TableActionButton, TableActions } from '@shared/ui/molecules/TableActions';
import { useToast } from '@shared/hooks/useToast';
import { formatCurrency, formatDate, formatNumber } from '@shared/lib/formatters';
import type {
  AporteMensualAdmin,
  EstadoAporteMensualAdmin,
} from '@shared/data/adminMockData';
import { useAportesAdmin } from '../../application/hooks/useAportesAdmin';
import {
  getComprobanteAporteAdmin,
  patchEstadoAporteAdmin,
  type ComprobanteAporteAdmin,
} from '../../infrastructure/api/admin-ahorro.api';

const ESTADOS: { value: EstadoAporteMensualAdmin; label: string }[] = [
  { value: 'pendiente', label: 'Pendiente' },
  { value: 'verificado', label: 'Verificado' },
  { value: 'incompleto', label: 'Incompleto' },
  { value: 'atrasado', label: 'Atrasado' },
  { value: 'rechazado', label: 'Rechazado' },
];

const PAGE_SIZE = 20;
const ESTADOS_REVISION: Exclude<EstadoAporteMensualAdmin, 'pendiente'>[] = [
  'verificado',
  'incompleto',
  'atrasado',
  'rechazado',
];

function getMesActual(): string {
  return new Date().toISOString().slice(0, 7);
}

export function AdminDashboardView() {
  const toast = useToast();
  const [estado, setEstado] = useState<EstadoAporteMensualAdmin>('pendiente');
  const [mes, setMes] = useState(getMesActual());
  const [page, setPage] = useState(1);
  const [aporteSeleccionado, setAporteSeleccionado] = useState<AporteMensualAdmin | null>(null);
  const [comprobante, setComprobante] = useState<ComprobanteAporteAdmin | null>(null);
  const [observaciones, setObservaciones] = useState('Comprobante correcto');
  const [cargandoComprobante, setCargandoComprobante] = useState(false);
  const [guardandoEstado, setGuardandoEstado] = useState<EstadoAporteMensualAdmin | null>(null);

  const { aportes, meta, cargando, error, recargar } = useAportesAdmin({
    estado,
    mes,
    page,
    limit: PAGE_SIZE,
  });

  const abrirComprobante = async (aporte: AporteMensualAdmin) => {
    setAporteSeleccionado(aporte);
    setComprobante(null);
    setObservaciones(
      aporte.estado === 'pendiente' || aporte.estado === 'verificado'
        ? 'Comprobante correcto'
        : '',
    );
    setCargandoComprobante(true);

    try {
      const data = await getComprobanteAporteAdmin(aporte.idAporteMensual);
      setComprobante(data);
    } catch {
      toast.error('No se pudo cargar el comprobante.');
    } finally {
      setCargandoComprobante(false);
    }
  };

  const cerrarComprobante = () => {
    if (guardandoEstado) return;
    setAporteSeleccionado(null);
    setComprobante(null);
    setObservaciones('Comprobante correcto');
  };

  const cambiarEstado = async (nuevoEstado: Exclude<EstadoAporteMensualAdmin, 'pendiente'>) => {
    if (!aporteSeleccionado) return;

    setGuardandoEstado(nuevoEstado);
    try {
      await patchEstadoAporteAdmin(aporteSeleccionado.idAporteMensual, {
        estado: nuevoEstado,
        observaciones: observaciones.trim() || `Estado cambiado a ${nuevoEstado}`,
      });
      toast.success(`Aporte marcado como ${nuevoEstado}.`);
      setAporteSeleccionado(null);
      setComprobante(null);
      setObservaciones('Comprobante correcto');
      await recargar();
    } catch {
      toast.error('No se pudo actualizar el estado del aporte.');
    } finally {
      setGuardandoEstado(null);
    }
  };

  const imagenComprobante = comprobante?.urlArchivo
    ? comprobante.urlArchivo.startsWith('data:')
      ? comprobante.urlArchivo
      : `data:image/png;base64,${comprobante.urlArchivo}`
    : '';

  const columns: TableColumn<AporteMensualAdmin>[] = [
    {
      key: 'socioNombre',
      header: 'Socio',
      render: (aporte) => (
        <div className="min-w-[12rem]">
          <p className="font-medium text-slate-900">{aporte.socioNombre}</p>
          <p className="font-mono text-[11px] text-slate-500">{aporte.socioCodigo}</p>
        </div>
      ),
    },
    {
      key: 'numeroCuenta',
      header: 'Cuenta',
      render: (aporte) => (
        <div className="min-w-[11rem]">
          <p className="font-medium text-slate-800">{aporte.cuentaNombre}</p>
          <p className="font-mono text-[11px] text-slate-500">{aporte.numeroCuenta}</p>
        </div>
      ),
    },
    { key: 'mes', header: 'Mes' },
    {
      key: 'monto',
      header: 'Monto',
      numeric: true,
      render: (aporte) => formatCurrency(aporte.monto, 'USD'),
    },
    {
      key: 'metaMensual',
      header: 'Meta',
      numeric: true,
      render: (aporte) => formatCurrency(aporte.metaMensual, 'USD'),
    },
    {
      key: 'estado',
      header: 'Estado',
      render: (aporte) => <StatusBadge status={aporte.estado} />,
    },
    {
      key: 'comprobante',
      header: 'Comprobante',
      render: (aporte) => (
        <span className="font-mono text-xs text-slate-700">{aporte.comprobante || '-'}</span>
      ),
    },
    {
      key: 'archivoNombre',
      header: 'Archivo',
      render: (aporte) => (
        <span className="block max-w-[12rem] truncate text-slate-700" title={aporte.archivoNombre}>
          {aporte.archivoNombre || '-'}
        </span>
      ),
    },
    {
      key: 'fechaRegistro',
      header: 'Registrado',
      render: (aporte) => formatDate(aporte.fechaRegistro),
    },
    {
      key: 'acciones',
      header: 'Acciones',
      render: (aporte) => (
        <TableActions>
          <TableActionButton type="button" onClick={() => void abrirComprobante(aporte)}>
            Ver comprobante
          </TableActionButton>
        </TableActions>
      ),
    },
  ];

  const aplicarFiltros = () => {
    setPage(1);
    void recargar();
  };

  const hayPaginaAnterior = page > 1 && !cargando;
  const hayPaginaSiguiente = page < meta.totalPages && !cargando;

  return (
    <div className="flex min-h-[calc(100dvh-14rem)] flex-col gap-4">
      <section className="rounded-lg border border-slate-200 bg-white">
        <div className="grid gap-3 border-b border-slate-100 p-4 md:grid-cols-[180px_180px_auto] md:items-end">
          <div>
            <label htmlFor="admin-aportes-estado" className="mb-1 block text-xs font-medium text-slate-600">
              Estado
            </label>
            <Select
              id="admin-aportes-estado"
              value={estado}
              onChange={(event) => {
                setEstado(event.target.value as EstadoAporteMensualAdmin);
                setPage(1);
              }}
            >
              {ESTADOS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </Select>
          </div>

          <div>
            <label htmlFor="admin-aportes-mes" className="mb-1 block text-xs font-medium text-slate-600">
              Mes
            </label>
            <Input
              id="admin-aportes-mes"
              type="month"
              value={mes}
              onChange={(event) => {
                setMes(event.target.value);
                setPage(1);
              }}
            />
          </div>

          <div className="flex flex-wrap items-center gap-2 md:justify-between">
            <ActionButton
              type="button"
              variant="outline"
              onClick={aplicarFiltros}
              disabled={cargando}
              icon={<NavIcon name="search" size={15} />}
            >
              Consultar
            </ActionButton>
            <p className="text-xs text-slate-500">
              {cargando
                ? 'Cargando aportes...'
                : error
                  ? error
                  : `${formatNumber(meta.total)} registro(s) encontrados`}
            </p>
          </div>
        </div>

        <div className="min-h-0 flex-1 overflow-auto">
          <Table
            columns={columns}
            data={aportes}
            emptyMessage={
              error
                ? error
                : `No hay aportes con estado ${estado} para ${mes}.`
            }
          />
        </div>
      </section>

      <div className="flex flex-col gap-3 rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm sm:flex-row sm:items-center sm:justify-between">
        <p className="text-slate-600">
          Pagina {formatNumber(meta.page)} de {formatNumber(meta.totalPages)} · limite {formatNumber(meta.limit)}
        </p>
        <div className="flex items-center gap-2">
          <ActionButton
            type="button"
            size="sm"
            variant="outline"
            onClick={() => setPage((current) => Math.max(1, current - 1))}
            disabled={!hayPaginaAnterior}
          >
            Anterior
          </ActionButton>
          <ActionButton
            type="button"
            size="sm"
            variant="outline"
            onClick={() => setPage((current) => Math.min(meta.totalPages, current + 1))}
            disabled={!hayPaginaSiguiente}
          >
            Siguiente
          </ActionButton>
        </div>
      </div>

      <Modal
        isOpen={Boolean(aporteSeleccionado)}
        onClose={cerrarComprobante}
        title="Comprobante de pago"
        size="lg"
      >
        <div className="grid gap-4 lg:grid-cols-[1fr_260px]">
          <div className="min-h-[18rem] overflow-hidden rounded-lg border border-slate-200 bg-slate-50">
            {cargandoComprobante ? (
              <div className="flex h-72 items-center justify-center text-sm text-slate-500">
                Cargando comprobante...
              </div>
            ) : imagenComprobante ? (
              <img
                src={imagenComprobante}
                alt={`Comprobante ${comprobante?.comprobante ?? ''}`}
                className="max-h-[70vh] w-full object-contain"
              />
            ) : (
              <div className="flex h-72 items-center justify-center text-sm text-slate-500">
                No se pudo mostrar la imagen.
              </div>
            )}
          </div>

          <aside className="flex flex-col gap-4">
            <div className="rounded-lg border border-slate-200 bg-white p-3 text-sm">
              <p className="font-semibold text-slate-900">{aporteSeleccionado?.socioNombre}</p>
              <p className="mt-1 font-mono text-xs text-slate-500">
                {aporteSeleccionado?.numeroCuenta}
              </p>
              <dl className="mt-3 grid gap-2 text-xs text-slate-600">
                <div className="flex justify-between gap-3">
                  <dt>Monto</dt>
                  <dd className="font-semibold text-slate-900">
                    {formatCurrency(aporteSeleccionado?.monto ?? 0, 'USD')}
                  </dd>
                </div>
                <div className="flex justify-between gap-3">
                  <dt>Meta</dt>
                  <dd className="font-semibold text-slate-900">
                    {formatCurrency(aporteSeleccionado?.metaMensual ?? 0, 'USD')}
                  </dd>
                </div>
                <div className="flex justify-between gap-3">
                  <dt>Estado</dt>
                  <dd>{aporteSeleccionado && <StatusBadge status={aporteSeleccionado.estado} />}</dd>
                </div>
              </dl>
            </div>

            <div>
              <label htmlFor="observaciones-aporte" className="mb-1 block text-xs font-medium text-slate-600">
                Observaciones
              </label>
              <TextArea
                id="observaciones-aporte"
                value={observaciones}
                onChange={(event) => setObservaciones(event.target.value)}
                placeholder="Escribe una observacion para el cambio de estado."
              />
            </div>

            <div className="grid gap-2">
              {ESTADOS_REVISION.map((nuevoEstado) => (
                <ActionButton
                  key={nuevoEstado}
                  type="button"
                  variant={nuevoEstado === 'rechazado' ? 'danger' : nuevoEstado === 'verificado' ? 'primary' : 'outline'}
                  onClick={() => void cambiarEstado(nuevoEstado)}
                  disabled={cargandoComprobante || Boolean(guardandoEstado)}
                  isLoading={guardandoEstado === nuevoEstado}
                  fullWidth
                >
                  Marcar {nuevoEstado}
                </ActionButton>
              ))}
            </div>
          </aside>
        </div>
      </Modal>
    </div>
  );
}

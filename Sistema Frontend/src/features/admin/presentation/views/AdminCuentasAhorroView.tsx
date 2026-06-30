import { useState } from 'react';
import { ActionButton } from '@shared/ui/atoms/ActionButton';
import { Select } from '@shared/ui/atoms/Select';
import { TextArea } from '@shared/ui/atoms/TextArea';
import { Modal } from '@shared/ui/molecules/Modal';
import { StatusBadge } from '@shared/ui/molecules/StatusBadge';
import { Table, type TableColumn } from '@shared/ui/molecules/Table';
import { TableActionButton, TableActions } from '@shared/ui/molecules/TableActions';
import { useToast } from '@shared/hooks/useToast';
import { formatCurrency, formatDate, formatNumber } from '@shared/lib/formatters';
import {
  patchResolverSolicitudCuentaAdmin,
  type EstadoSolicitudCuentaAdmin,
  type SolicitudCuentaAdmin,
  type TipoSolicitudCuentaAdmin,
} from '../../infrastructure/api/admin-ahorro.api';
import { useSolicitudesCuentaAdmin } from '../../application/hooks/useSolicitudesCuentaAdmin';

const PAGE_SIZE = 10;

export function AdminCuentasAhorroView() {
  const toast = useToast();
  const [estado, setEstado] = useState<EstadoSolicitudCuentaAdmin | ''>('pendiente');
  const [tipo, setTipo] = useState<TipoSolicitudCuentaAdmin | ''>('');
  const [page, setPage] = useState(1);
  const [solicitudSeleccionada, setSolicitudSeleccionada] = useState<SolicitudCuentaAdmin | null>(null);
  const [observaciones, setObservaciones] = useState('Aprobado tras revision');
  const [resolviendo, setResolviendo] = useState<'aprobar' | 'rechazar' | null>(null);

  const { solicitudes, meta, cargando, error, recargar } = useSolicitudesCuentaAdmin({
    estado,
    tipo,
    page,
    limit: PAGE_SIZE,
  });

  const abrirResolver = (solicitud: SolicitudCuentaAdmin) => {
    setSolicitudSeleccionada(solicitud);
    setObservaciones(
      solicitud.estado === 'rechazada'
        ? 'Rechazado tras revision'
        : 'Aprobado tras revision',
    );
  };

  const resolverSolicitud = async (aprobar: boolean) => {
    if (!solicitudSeleccionada) return;

    setResolviendo(aprobar ? 'aprobar' : 'rechazar');
    try {
      await patchResolverSolicitudCuentaAdmin(solicitudSeleccionada.idSolicitudCuenta, {
        aprobar,
        observaciones: observaciones.trim() || (aprobar ? 'Aprobado tras revision' : 'Rechazado tras revision'),
      });
      toast.success(`Solicitud ${aprobar ? 'aprobada' : 'rechazada'}.`);
      setSolicitudSeleccionada(null);
      setObservaciones('Aprobado tras revision');
      await recargar();
    } catch {
      toast.error('No se pudo resolver la solicitud.');
    } finally {
      setResolviendo(null);
    }
  };

  const columns: TableColumn<SolicitudCuentaAdmin>[] = [
    {
      key: 'socioNombre',
      header: 'Socio',
      render: (solicitud) => (
        <div className="min-w-[12rem]">
          <p className="font-medium text-slate-900">{solicitud.socioNombre}</p>
          <p className="font-mono text-[11px] text-slate-500">{solicitud.socioId}</p>
        </div>
      ),
    },
    {
      key: 'numeroCuentaOrigen',
      header: 'Cuenta origen',
      render: (solicitud) => (
        <span className="font-mono text-xs text-slate-700">{solicitud.numeroCuentaOrigen}</span>
      ),
    },
    {
      key: 'tipo',
      header: 'Tipo',
      render: (solicitud) => <StatusBadge status={solicitud.tipo} label={solicitud.tipo} />,
    },
    {
      key: 'monto',
      header: 'Monto',
      numeric: true,
      render: (solicitud) =>
        solicitud.monto == null ? '-' : formatCurrency(solicitud.monto, 'USD'),
    },
    {
      key: 'estado',
      header: 'Estado',
      render: (solicitud) => <StatusBadge status={solicitud.estado} />,
    },
    {
      key: 'motivo',
      header: 'Motivo',
      render: (solicitud) => (
        <span className="block max-w-[18rem] truncate" title={solicitud.motivo}>
          {solicitud.motivo || '-'}
        </span>
      ),
    },
    {
      key: 'observaciones',
      header: 'Observaciones',
      render: (solicitud) => (
        <span className="block max-w-[18rem] truncate" title={solicitud.observaciones ?? ''}>
          {solicitud.observaciones || '-'}
        </span>
      ),
    },
    {
      key: 'createdAt',
      header: 'Creada',
      render: (solicitud) => formatDate(solicitud.createdAt),
    },
    {
      key: 'fechaResolucion',
      header: 'Resolucion',
      render: (solicitud) =>
        solicitud.fechaResolucion ? formatDate(solicitud.fechaResolucion) : '-',
    },
    {
      key: 'acciones',
      header: 'Acciones',
      render: (solicitud) => (
        <TableActions>
          <TableActionButton
            type="button"
            onClick={() => abrirResolver(solicitud)}
            disabled={solicitud.estado !== 'pendiente'}
          >
            Resolver
          </TableActionButton>
        </TableActions>
      ),
    },
  ];

  const cambiarEstado = (value: EstadoSolicitudCuentaAdmin | '') => {
    setEstado(value);
    setPage(1);
  };

  const cambiarTipo = (value: TipoSolicitudCuentaAdmin | '') => {
    setTipo(value);
    setPage(1);
  };

  return (
    <div className="flex min-h-[calc(100dvh-14rem)] flex-col gap-4">
      <section className="rounded-lg border border-slate-200 bg-white">
        <div className="grid gap-3 border-b border-slate-100 p-4 md:grid-cols-[180px_180px_auto] md:items-end">
          <div>
            <label htmlFor="solicitudes-estado" className="mb-1 block text-xs font-medium text-slate-600">
              Estado
            </label>
            <Select
              id="solicitudes-estado"
              value={estado}
              onChange={(event) => cambiarEstado(event.target.value as EstadoSolicitudCuentaAdmin | '')}
            >
              <option value="">Todos</option>
              <option value="pendiente">Pendiente</option>
              <option value="aprobada">Aprobada</option>
              <option value="rechazada">Rechazada</option>
            </Select>
          </div>

          <div>
            <label htmlFor="solicitudes-tipo" className="mb-1 block text-xs font-medium text-slate-600">
              Tipo
            </label>
            <Select
              id="solicitudes-tipo"
              value={tipo}
              onChange={(event) => cambiarTipo(event.target.value as TipoSolicitudCuentaAdmin | '')}
            >
              <option value="">Todos</option>
              <option value="retiro">Retiro</option>
              <option value="eliminacion">Eliminacion</option>
            </Select>
          </div>

          <p className="text-xs text-slate-500 md:text-right">
            {cargando
              ? 'Cargando solicitudes...'
              : error
                ? error
                : `${formatNumber(meta.total)} solicitud(es) encontradas`}
          </p>
        </div>

        <Table
          columns={columns}
          data={solicitudes}
          emptyMessage={error ?? 'No hay solicitudes con los filtros seleccionados.'}
        />
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
            disabled={page <= 1 || cargando}
          >
            Anterior
          </ActionButton>
          <ActionButton
            type="button"
            size="sm"
            variant="outline"
            onClick={() => setPage((current) => Math.min(meta.totalPages, current + 1))}
            disabled={page >= meta.totalPages || cargando}
          >
            Siguiente
          </ActionButton>
        </div>
      </div>

      <Modal
        isOpen={Boolean(solicitudSeleccionada)}
        onClose={() => {
          if (!resolviendo) setSolicitudSeleccionada(null);
        }}
        title="Resolver solicitud"
      >
        {solicitudSeleccionada && (
          <div className="flex flex-col gap-4">
            <div className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
              <p className="font-semibold text-slate-900">{solicitudSeleccionada.socioNombre}</p>
              <p className="mt-1 font-mono text-xs">{solicitudSeleccionada.numeroCuentaOrigen}</p>
              <div className="mt-3 grid gap-2 sm:grid-cols-2">
                <p>Tipo: <strong>{solicitudSeleccionada.tipo}</strong></p>
                <p>
                  Monto:{' '}
                  <strong>
                    {solicitudSeleccionada.monto == null
                      ? '-'
                      : formatCurrency(solicitudSeleccionada.monto, 'USD')}
                  </strong>
                </p>
              </div>
              <p className="mt-3">Motivo: {solicitudSeleccionada.motivo || '-'}</p>
            </div>

            <div>
              <label htmlFor="resolver-observaciones" className="mb-1 block text-xs font-medium text-slate-600">
                Observaciones
              </label>
              <TextArea
                id="resolver-observaciones"
                value={observaciones}
                onChange={(event) => setObservaciones(event.target.value)}
                placeholder="Escribe una observacion para la resolucion."
              />
            </div>

            <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
              <ActionButton
                type="button"
                variant="danger"
                onClick={() => void resolverSolicitud(false)}
                disabled={Boolean(resolviendo)}
                isLoading={resolviendo === 'rechazar'}
              >
                Rechazar
              </ActionButton>
              <ActionButton
                type="button"
                onClick={() => void resolverSolicitud(true)}
                disabled={Boolean(resolviendo)}
                isLoading={resolviendo === 'aprobar'}
              >
                Aprobar
              </ActionButton>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

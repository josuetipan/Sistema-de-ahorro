import { useState } from 'react';
import { ActionButton } from '@shared/ui/atoms/ActionButton';
import { Input } from '@shared/ui/atoms/Input';
import { Select } from '@shared/ui/atoms/Select';
import { TextArea } from '@shared/ui/atoms/TextArea';
import { SectionCard } from '@shared/ui/molecules/SectionCard';
import { StatusBadge } from '@shared/ui/molecules/StatusBadge';
import { Table, type TableColumn } from '@shared/ui/molecules/Table';
import { useToast } from '@shared/hooks/useToast';
import { useCuentaActiva } from '@shared/hooks/useCuentaActiva';
import { formatCurrency, formatDate } from '@shared/lib/formatters';
import { useSolicitudesCuenta } from '@features/cuentas/application/hooks/useSolicitudesCuenta';
import type { SolicitudCuenta, TipoSolicitudCuenta } from '@features/cuentas/domain/cuenta.entity';

export function SolicitudesCuentaView() {
  const { cuentaActiva, cuentas } = useCuentaActiva();
  const { solicitudes, cargando, error, crear } = useSolicitudesCuenta();
  const toast = useToast();
  const [tipoSolicitud, setTipoSolicitud] = useState<TipoSolicitudCuenta>('retiro');
  const [monto, setMonto] = useState('');
  const [cuentaDestinoId, setCuentaDestinoId] = useState('');
  const [motivo, setMotivo] = useState('');
  const [enviando, setEnviando] = useState(false);

  if (!cuentaActiva) return null;

  const cuentasDestino = cuentas.filter((cuenta) => cuenta.id !== cuentaActiva.id);
  const nombreCuenta = (cuentaId: string) => {
    const cuenta = cuentas.find((item) => item.id === cuentaId);
    return cuenta ? `${cuenta.nombre} - ${cuenta.numeroCuenta}` : cuentaId;
  };

  const columns: TableColumn<SolicitudCuenta>[] = [
    {
      key: 'cuentaOrigenId',
      header: 'Cuenta',
      render: (solicitud) => (
        <span className="block max-w-[14rem] truncate" title={nombreCuenta(solicitud.cuentaOrigenId)}>
          {nombreCuenta(solicitud.cuentaOrigenId)}
        </span>
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
        <span className="block max-w-[18rem] truncate" title={solicitud.motivo ?? ''}>
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
      header: 'Fecha',
      render: (solicitud) => formatDate(solicitud.createdAt),
    },
  ];

  const enviarSolicitud = async () => {
    const montoNumber = Number(monto);

    if (tipoSolicitud === 'retiro' && (!Number.isFinite(montoNumber) || montoNumber <= 0)) {
      toast.error('Ingresa un monto de retiro mayor a cero.');
      return;
    }

    setEnviando(true);
    try {
      await crear(cuentaActiva.id, {
        tipo: tipoSolicitud,
        motivo: motivo.trim() || undefined,
        ...(tipoSolicitud === 'retiro'
          ? {
              monto: montoNumber,
              cuentaDestinoId: cuentaDestinoId || undefined,
            }
          : {}),
      });
      toast.success('Solicitud enviada.');
      setMonto('');
      setCuentaDestinoId('');
      setMotivo('');
      setTipoSolicitud('retiro');
    } catch {
      toast.error('No se pudo enviar la solicitud.');
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div className="flex min-h-[calc(100dvh-12rem)] flex-col gap-4">
      <SectionCard title="Nueva solicitud">
        <div className="grid gap-4 lg:grid-cols-[320px_1fr]">
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
            <p className="text-sm font-semibold text-slate-900">{cuentaActiva.nombre}</p>
            <p className="mt-1 font-mono text-xs text-slate-500">{cuentaActiva.numeroCuenta}</p>
            <p className="mt-3 text-xs text-slate-500">
              Las solicitudes quedan pendientes hasta que administracion las revise.
            </p>
          </div>

          <div className="grid gap-3 md:grid-cols-2">
            <div>
              <label htmlFor="solicitud-tipo" className="mb-1 block text-xs font-medium text-slate-600">
                Tipo de solicitud
              </label>
              <Select
                id="solicitud-tipo"
                value={tipoSolicitud}
                onChange={(event) => setTipoSolicitud(event.target.value as TipoSolicitudCuenta)}
              >
                <option value="retiro">Retiro de dinero</option>
                <option value="eliminacion">Eliminar cuenta</option>
              </Select>
            </div>

            {tipoSolicitud === 'retiro' && (
              <div>
                <label htmlFor="solicitud-monto" className="mb-1 block text-xs font-medium text-slate-600">
                  Monto
                </label>
                <Input
                  id="solicitud-monto"
                  type="number"
                  min={0}
                  step="0.01"
                  value={monto}
                  onChange={(event) => setMonto(event.target.value)}
                  placeholder="200.00"
                />
              </div>
            )}

            {tipoSolicitud === 'retiro' && (
              <div className="md:col-span-2">
                <label htmlFor="solicitud-destino" className="mb-1 block text-xs font-medium text-slate-600">
                  Cuenta destino
                </label>
                <Select
                  id="solicitud-destino"
                  value={cuentaDestinoId}
                  onChange={(event) => setCuentaDestinoId(event.target.value)}
                >
                  <option value="">Sin cuenta destino</option>
                  {cuentasDestino.map((cuenta) => (
                    <option key={cuenta.id} value={cuenta.id}>
                      {cuenta.nombre} - {cuenta.numeroCuenta}
                    </option>
                  ))}
                </Select>
              </div>
            )}

            <div className="md:col-span-2">
              <label htmlFor="solicitud-motivo" className="mb-1 block text-xs font-medium text-slate-600">
                Motivo
              </label>
              <TextArea
                id="solicitud-motivo"
                value={motivo}
                onChange={(event) => setMotivo(event.target.value)}
                placeholder={tipoSolicitud === 'retiro' ? 'Retiro parcial' : 'Ya no usare esta cuenta'}
              />
            </div>

            <div className="md:col-span-2 md:flex md:justify-end">
              <ActionButton
                type="button"
                onClick={enviarSolicitud}
                isLoading={enviando}
                disabled={enviando}
              >
                Enviar solicitud
              </ActionButton>
            </div>
          </div>
        </div>
      </SectionCard>

      <SectionCard title="Mis solicitudes">
        {cargando ? (
          <p className="py-8 text-center text-sm text-slate-500">Cargando solicitudes...</p>
        ) : (
          <Table
            columns={columns}
            data={solicitudes}
            emptyMessage={error ?? 'No tienes solicitudes registradas.'}
          />
        )}
      </SectionCard>
    </div>
  );
}

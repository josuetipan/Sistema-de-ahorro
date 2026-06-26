import { useMemo, useState } from 'react';
import { ActionButton } from '@shared/ui/atoms/ActionButton';
import { Input } from '@shared/ui/atoms/Input';
import { Select } from '@shared/ui/atoms/Select';
import { FormField } from '@shared/ui/molecules/FormField';
import { SearchBar } from '@shared/ui/molecules/SearchBar';
import { SectionCard } from '@shared/ui/molecules/SectionCard';
import { StatusBadge } from '@shared/ui/molecules/StatusBadge';
import { Table, type TableColumn } from '@shared/ui/molecules/Table';
import { useToast } from '@shared/hooks/useToast';
import { formatCurrency, formatDate } from '@shared/lib/formatters';
import {
  LABEL_TIPO_MOV_ADMIN,
  MOCK_MOVIMIENTOS_ADMIN,
  MOCK_SOCIOS,
  type MovimientoAdmin,
  type TipoMovimientoAdmin,
} from '@shared/data/adminMockData';

export function AdminMovimientosView() {
  const toast = useToast();
  const [busqueda, setBusqueda] = useState('');
  const [tipo, setTipo] = useState<'todos' | TipoMovimientoAdmin>('todos');
  const [desde, setDesde] = useState('');
  const [hasta, setHasta] = useState('');

  const filtrados = useMemo(() => {
    return MOCK_MOVIMIENTOS_ADMIN.filter((m) => {
      const matchTipo = tipo === 'todos' || m.tipo === tipo;
      const q = busqueda.toLowerCase();
      const matchSocio = !q || m.socio.toLowerCase().includes(q) || m.referencia.toLowerCase().includes(q);
      const fecha = new Date(m.fecha);
      const matchDesde = !desde || fecha >= new Date(desde);
      const matchHasta = !hasta || fecha <= new Date(`${hasta}T23:59:59`);
      return matchTipo && matchSocio && matchDesde && matchHasta;
    });
  }, [busqueda, tipo, desde, hasta]);

  const columns: TableColumn<MovimientoAdmin>[] = [
    { key: 'fecha', header: 'Fecha', render: (r) => formatDate(r.fecha) },
    { key: 'tipo', header: 'Tipo', render: (r) => <StatusBadge status={r.tipo} label={LABEL_TIPO_MOV_ADMIN[r.tipo]} /> },
    { key: 'socio', header: 'Socio' },
    { key: 'monto', header: 'Monto', numeric: true, render: (r) => formatCurrency(r.monto) },
    { key: 'descripcion', header: 'Descripción' },
    { key: 'referencia', header: 'Referencia' },
  ];

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-4">
        {/* Filtros — apilados verticalmente, no en columnas flotantes */}
        <FormField label="Buscar socio" htmlFor="mov-buscar">
          <SearchBar id="mov-buscar" value={busqueda} onChange={setBusqueda} placeholder="Nombre o referencia…" />
        </FormField>
        <FormField label="Tipo de movimiento" htmlFor="mov-tipo">
          <Select id="mov-tipo" value={tipo} onChange={(e) => setTipo(e.target.value as typeof tipo)}>
            <option value="todos">Todos los tipos</option>
            <option value="deposito">Depósitos</option>
            <option value="retiro">Retiros</option>
            <option value="pago">Pagos</option>
            <option value="desembolso">Desembolsos</option>
          </Select>
        </FormField>
        <div className="grid grid-cols-2 gap-3">
          <FormField label="Desde" htmlFor="mov-desde">
            <Input id="mov-desde" type="date" value={desde} onChange={(e) => setDesde(e.target.value)} />
          </FormField>
          <FormField label="Hasta" htmlFor="mov-hasta">
            <Input id="mov-hasta" type="date" value={hasta} onChange={(e) => setHasta(e.target.value)} />
          </FormField>
        </div>

        <div className="flex justify-end">
          <ActionButton type="button" variant="outline" onClick={() => toast.success('Historial exportado (demo).')}>
            Exportar historial
          </ActionButton>
        </div>

        <SectionCard title="Movimientos del sistema">
          <Table columns={columns} data={filtrados} />
          <p className="mt-3 text-xs text-slate-400">{filtrados.length} movimientos · {MOCK_SOCIOS.length} socios registrados</p>
        </SectionCard>
      </div>
    </div>
  );
}

// Historial — barra de filtros horizontal compacta, sin FormGrid
import { useMemo, useState } from 'react';
import { Table, type TableColumn } from '@shared/ui/molecules/Table';
import { StatusBadge } from '@shared/ui/molecules/StatusBadge';
import { SearchBar } from '@shared/ui/molecules/SearchBar';
import { TabbedContentShell } from '@shared/ui/molecules/TabbedContentShell';
import { SectionHeading } from '@shared/ui/molecules/SectionHeading';
import { formatCurrency, formatDate } from '@shared/lib/formatters';
import { MOCK_HISTORIAL, type HistorialItem } from '@shared/data/mockData';
import { Input } from '@shared/ui/atoms/Input';
import { Select } from '@shared/ui/atoms/Select';
import { ActionButton } from '@shared/ui/atoms/ActionButton';

const TABS = [
  { id: 'todos',    label: 'Todos' },
  { id: 'ahorro',   label: 'Ahorros' },
  { id: 'credito',  label: 'Créditos' },
  { id: 'pago',     label: 'Pagos' },
  { id: 'solicitud',label: 'Solicitudes' },
];

const LABEL_CATEGORIA: Record<HistorialItem['categoria'], string> = {
  ahorro:    'Ahorro',
  credito:   'Crédito',
  pago:      'Pago',
  solicitud: 'Solicitud',
};

export function HistorialView() {
  const [categoria, setCategoria] = useState('todos');
  const [busqueda, setBusqueda] = useState('');
  const [desde, setDesde] = useState('');
  const [hasta, setHasta] = useState('');
  const [estado, setEstado] = useState('todos');

  const items = useMemo(() => {
    return MOCK_HISTORIAL.filter((h) => {
      const matchCat  = categoria === 'todos' || h.categoria === categoria;
      const q         = busqueda.toLowerCase();
      const matchQ    = !q || h.descripcion.toLowerCase().includes(q) || h.estado.includes(q);
      const fecha     = new Date(h.fecha);
      const matchDesde= !desde || fecha >= new Date(desde);
      const matchHasta= !hasta || fecha <= new Date(`${hasta}T23:59:59`);
      const matchEst  = estado === 'todos' || h.estado === estado;
      return matchCat && matchQ && matchDesde && matchHasta && matchEst;
    });
  }, [categoria, busqueda, desde, hasta, estado]);

  const columns: TableColumn<HistorialItem>[] = [
    { key: 'fecha',      header: 'Fecha',      render: (r) => formatDate(r.fecha) },
    { key: 'categoria',  header: 'Categoría',  render: (r) => LABEL_CATEGORIA[r.categoria] },
    { key: 'descripcion',header: 'Descripción' },
    { key: 'monto',      header: 'Monto',       numeric: true, render: (r) => (r.monto != null ? formatCurrency(r.monto) : '—') },
    { key: 'estado',     header: 'Estado',      render: (r) => <StatusBadge status={r.estado} /> },
  ];

  const limpiar = () => {
    setDesde('');
    setHasta('');
    setEstado('todos');
    setBusqueda('');
  };

  return (
    <TabbedContentShell
      tabs={TABS}
      activeTab={categoria}
      onTabChange={setCategoria}
      ariaLabel="Categoría de historial"
    >
      <div className="flex flex-col gap-4">

        {/* ── Barra de filtros horizontal ── */}
        <div className="flex flex-wrap items-end gap-3 rounded-lg border border-slate-200 bg-slate-50/60 p-3">
          <div className="min-w-[120px] flex-1">
            <label className="mb-1 block text-xs font-medium text-slate-600" htmlFor="hist-desde">
              Desde
            </label>
            <Input
              type="date"
              id="hist-desde"
              inputSize="sm"
              value={desde}
              onChange={(e) => setDesde(e.target.value)}
            />
          </div>
          <div className="min-w-[120px] flex-1">
            <label className="mb-1 block text-xs font-medium text-slate-600" htmlFor="hist-hasta">
              Hasta
            </label>
            <Input
              type="date"
              id="hist-hasta"
              inputSize="sm"
              value={hasta}
              onChange={(e) => setHasta(e.target.value)}
            />
          </div>
          <div className="min-w-[140px] flex-1">
            <label className="mb-1 block text-xs font-medium text-slate-600" htmlFor="hist-estado">
              Estado
            </label>
            <Select
              id="hist-estado"
              selectSize="sm"
              value={estado}
              onChange={(e) => setEstado(e.target.value)}
            >
              <option value="todos">Todos</option>
              <option value="pendiente">Pendiente</option>
              <option value="aprobado">Aprobado</option>
              <option value="rechazado">Rechazado</option>
              <option value="completado">Completado</option>
            </Select>
          </div>
          <div className="flex gap-2">
            <ActionButton type="button" variant="outline" size="sm" onClick={limpiar}>
              Limpiar
            </ActionButton>
            <ActionButton type="button" size="sm" onClick={() => window.print()}>
              Exportar
            </ActionButton>
          </div>
        </div>

        {/* ── Tabla ── */}
        <section>
          <SectionHeading
            title={`${items.length} registro(s)`}
            action={
              <SearchBar
                value={busqueda}
                onChange={setBusqueda}
                placeholder="Buscar en historial…"
                className="w-52"
              />
            }
          />
          <Table
            columns={columns}
            data={items}
            emptyMessage="No hay registros en esta categoría."
          />
        </section>

      </div>
    </TabbedContentShell>
  );
}

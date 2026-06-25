import { useMemo, useState } from 'react';
import { ActionButton } from '@shared/ui/atoms/ActionButton';
import { FilterChipGroup } from '@shared/ui/molecules/FilterChipGroup';
import { Modal } from '@shared/ui/molecules/Modal';
import { SearchBar } from '@shared/ui/molecules/SearchBar';
import { SectionCard } from '@shared/ui/molecules/SectionCard';
import { useToast } from '@shared/hooks/useToast';
import {
  useSocios,
  AdminCreateSocioForm,
  SocioCard,
  SocioPerfilDetalle,
  type EstadoSocio,
  type Socio,
} from '@features/socio';

type FiltroEstado = 'todos' | EstadoSocio;

export function AdminSociosView() {
  const toast = useToast();
  const { socios, cargando, crear, actualizar, cambiarEstado, validarCodigoReferencia } = useSocios();
  const [busqueda, setBusqueda] = useState('');
  const [filtro, setFiltro] = useState<FiltroEstado>('todos');
  const [modal, setModal] = useState<'crear' | 'editar' | 'perfil' | null>(null);
  const [seleccionado, setSeleccionado] = useState<Socio | null>(null);

  const filtrados = useMemo(() => {
    return socios.filter((s) => {
      const matchEstado = filtro === 'todos' || s.estado === filtro;
      const q = busqueda.toLowerCase();
      const matchBusqueda =
        !q ||
        s.nombres.toLowerCase().includes(q) ||
        s.cedula.includes(q) ||
        s.email.toLowerCase().includes(q) ||
        s.codigoReferencia.toLowerCase().includes(q) ||
        (s.referidoPor?.toLowerCase().includes(q) ?? false);
      return matchEstado && matchBusqueda;
    });
  }, [socios, busqueda, filtro]);

  const abrirCrear = () => {
    setSeleccionado(null);
    setModal('crear');
  };

  const abrirEditar = (socio: Socio) => {
    setSeleccionado(socio);
    setModal('editar');
  };

  const abrirPerfil = (socio: Socio) => {
    setSeleccionado(socio);
    setModal('perfil');
  };

  const toggleEstado = async (socio: Socio) => {
    const activar = socio.estado !== 'activo';
    try {
      await cambiarEstado(socio.id, activar);
      toast.success(`Socio ${activar ? 'activado' : 'desactivado'}.`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'No se pudo cambiar el estado.');
    }
  };

  const guardarCrear = async (values: Parameters<typeof crear>[0]) => {
    try {
      await crear(values);
      toast.success('Socio creado correctamente.');
      setModal(null);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'No se pudo crear el socio.');
    }
  };

  const guardarEditar = async (values: Parameters<typeof crear>[0]) => {
    if (!seleccionado) return;
    try {
      await actualizar(seleccionado.id, values);
      toast.success('Socio actualizado.');
      setModal(null);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'No se pudo actualizar el socio.');
    }
  };

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <SearchBar
          value={busqueda}
          onChange={setBusqueda}
          placeholder="Buscar por nombre, cédula, correo o código…"
          className="sm:max-w-sm"
        />
        <ActionButton type="button" onClick={abrirCrear}>
          Nuevo socio
        </ActionButton>
      </div>

      <div className="flex flex-col gap-4">
        <FilterChipGroup
          ariaLabel="Filtrar por estado"
          value={filtro}
          onChange={setFiltro}
          options={[
            { value: 'todos', label: 'Todos', count: socios.length },
            { value: 'activo', label: 'Activos', count: socios.filter((s) => s.estado === 'activo').length },
            { value: 'inactivo', label: 'Inactivos', count: socios.filter((s) => s.estado === 'inactivo').length },
            { value: 'pendiente', label: 'Pendientes', count: socios.filter((s) => s.estado === 'pendiente').length },
          ]}
        />

        <SectionCard title="Socios y cuentas de ahorro">
          {cargando ? (
            <p className="py-8 text-center text-sm text-slate-500">Cargando socios…</p>
          ) : filtrados.length === 0 ? (
            <p className="py-8 text-center text-sm text-slate-500">
              No se encontraron socios con esos filtros.
            </p>
          ) : (
            <div className="flex flex-col gap-3">
              {filtrados.map((socio) => (
                <SocioCard
                  key={socio.id}
                  socio={socio}
                  socios={socios}
                  onVer={abrirPerfil}
                  onEditar={abrirEditar}
                  onToggleEstado={(s) => void toggleEstado(s)}
                />
              ))}
            </div>
          )}
        </SectionCard>
      </div>

      <Modal
        isOpen={modal === 'perfil' && !!seleccionado}
        onClose={() => setModal(null)}
        title="Perfil del socio"
      >
        {seleccionado && <SocioPerfilDetalle socio={seleccionado} socios={socios} />}
      </Modal>

      <Modal
        isOpen={modal === 'crear' || modal === 'editar'}
        onClose={() => setModal(null)}
        title={modal === 'crear' ? 'Crear socio' : 'Editar socio'}
      >
        <AdminCreateSocioForm
          modo={modal === 'editar' ? 'editar' : 'crear'}
          socio={seleccionado}
          onSubmit={modal === 'editar' ? guardarEditar : guardarCrear}
          onCancel={() => setModal(null)}
          validarCodigoReferencia={validarCodigoReferencia}
        />
      </Modal>
    </div>
  );
}

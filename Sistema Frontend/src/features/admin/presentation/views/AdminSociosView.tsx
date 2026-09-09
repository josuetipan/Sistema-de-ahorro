import { useState } from 'react';
import { ActionButton } from '@shared/ui/atoms/ActionButton';
import { Input } from '@shared/ui/atoms/Input';
import { NavIcon } from '@shared/ui/atoms/NavIcon';
import { Select } from '@shared/ui/atoms/Select';
import { Modal } from '@shared/ui/molecules/Modal';
import { FormField } from '@shared/ui/molecules/FormField';
import { Button } from '@shared/ui/atoms/Button';
import { StatusBadge } from '@shared/ui/molecules/StatusBadge';
import { Table, type TableColumn } from '@shared/ui/molecules/Table';
import { TableActionButton, TableActions } from '@shared/ui/molecules/TableActions';
import { formatCurrency, formatDate, formatNumber } from '@shared/lib/formatters';
import {
  type CuentaSocioAdmin,
  type EstadoCuentaAhorroAdmin,
  type EstadoSocioAdmin,
  type RoleCodeAdmin,
  type SocioAhorroAdmin,
} from '../../infrastructure/api/admin-ahorro.api';
import { useSociosAhorroAdmin } from '../../application/hooks/useSociosAhorroAdmin';
import { useToast } from '@shared/hooks/useToast';
import {
  createAdminUser,
  setAdminUserStatus,
  updateAdminUser,
} from '../../infrastructure/api/admin-users.api';

const PAGE_SIZE = 5;
type RoleCode = 'ADMIN' | 'CUSTOMER' | 'ACCOUNTANT';

interface SociosFiltros {
  q: string;
  estado: EstadoSocioAdmin | '';
  codigo: string;
  nombre: string;
  email: string;
  identification: string;
  roleCode: RoleCodeAdmin | '';
  cuentaEstado: EstadoCuentaAhorroAdmin | '';
}

const EMPTY_FILTERS: SociosFiltros = {
  q: '',
  estado: '',
  codigo: '',
  nombre: '',
  email: '',
  identification: '',
  roleCode: '',
  cuentaEstado: '',
};

function clean(value: string): string | undefined {
  const trimmed = value.trim();
  return trimmed ? trimmed : undefined;
}

export function AdminSociosView() {
  const toast = useToast();
  const [draftFilters, setDraftFilters] = useState<SociosFiltros>(EMPTY_FILTERS);
  const [filters, setFilters] = useState<SociosFiltros>(EMPTY_FILTERS);
  const [page, setPage] = useState(1);
  const [seleccionado, setSeleccionado] = useState<SocioAhorroAdmin | null>(null);
  const [modalUsuario, setModalUsuario] = useState<SocioAhorroAdmin | null | false>(false);
  const [formUsuario, setFormUsuario] = useState({
    fullName: '',
    identification: '',
    email: '',
    phoneNumber: '',
    address: '',
    password: '',
    roleCode: 'CUSTOMER' as RoleCode,
  });

  const { socios, meta, cargando, error, recargar } = useSociosAhorroAdmin({
    page,
    limit: PAGE_SIZE,
    q: clean(filters.q),
    estado: filters.estado,
    codigo: clean(filters.codigo),
    nombre: clean(filters.nombre),
    email: clean(filters.email),
    identification: clean(filters.identification),
    roleCode: filters.roleCode,
    cuentaEstado: filters.cuentaEstado,
  });

  const aplicarFiltros = () => {
    setFilters(draftFilters);
    setPage(1);
  };

  const limpiarFiltros = () => {
    setDraftFilters(EMPTY_FILTERS);
    setFilters(EMPTY_FILTERS);
    setPage(1);
  };

  const abrirCrearUsuario = () => {
    setModalUsuario(null);
    setFormUsuario({
      fullName: '',
      identification: '',
      email: '',
      phoneNumber: '',
      address: '',
      password: '',
      roleCode: 'CUSTOMER',
    });
  };

  const abrirEditarUsuario = (socio: SocioAhorroAdmin) => {
    setModalUsuario(socio);
    setFormUsuario({
      fullName: socio.fullName,
      identification: socio.identification,
      email: socio.email,
      phoneNumber: socio.phoneNumber,
      address: '',
      password: '',
      roleCode: 'CUSTOMER',
    });
  };

  const guardarUsuario = async () => {
    if (
      !formUsuario.fullName ||
      !formUsuario.identification ||
      !formUsuario.email ||
      !formUsuario.phoneNumber ||
      (!modalUsuario && !formUsuario.address)
    ) {
      toast.error('Completa los datos obligatorios.');
      return;
    }
    try {
      if (modalUsuario) {
        await updateAdminUser(modalUsuario.userId, {
          fullName: formUsuario.fullName,
          identification: formUsuario.identification,
          email: formUsuario.email,
          phoneNumber: formUsuario.phoneNumber,
        });
        toast.success('Socio actualizado correctamente.');
      } else {
        if (!formUsuario.password) {
          toast.error('La contraseña inicial es obligatoria.');
          return;
        }
        await createAdminUser(formUsuario);
        toast.success('Socio creado correctamente.');
      }
      setModalUsuario(false);
      await recargar();
    } catch {
      toast.error('No se pudo guardar el socio.');
    }
  };

  const cambiarEstadoUsuario = async (socio: SocioAhorroAdmin) => {
    try {
      await setAdminUserStatus(socio.userId, socio.estado === 'inactivo');
      toast.success(socio.estado === 'inactivo' ? 'Socio activado.' : 'Socio desactivado.');
      await recargar();
    } catch {
      toast.error('No se pudo cambiar el estado del socio.');
    }
  };

  const socioColumns: TableColumn<SocioAhorroAdmin>[] = [
    {
      key: 'fullName',
      header: 'Socio',
      render: (socio) => (
        <div className="min-w-[13rem]">
          <p className="font-medium text-slate-900">{socio.fullName}</p>
          <p className="font-mono text-[11px] text-slate-500">{socio.codigo ?? '-'}</p>
        </div>
      ),
    },
    {
      key: 'email',
      header: 'Contacto',
      render: (socio) => (
        <div className="min-w-[14rem]">
          <p className="text-slate-800">{socio.email}</p>
          <p className="font-mono text-[11px] text-slate-500">{socio.phoneNumber || '-'}</p>
        </div>
      ),
    },
    {
      key: 'identification',
      header: 'Identificacion',
      render: (socio) => <span className="font-mono text-xs">{socio.identification}</span>,
    },
    {
      key: 'roleName',
      header: 'Rol',
      render: (socio) =>
        socio.roleName || {
          ADMIN: 'Administrador',
          CUSTOMER: 'Cliente',
          ACCOUNTANT: 'Contador',
        }[socio.roleCode] || 'Sin rol',
    },
    {
      key: 'estado',
      header: 'Estado',
      render: (socio) => <StatusBadge status={socio.estado} />,
    },
    {
      key: 'totalAhorrado',
      header: 'Total ahorrado',
      numeric: true,
      render: (socio) => formatCurrency(socio.totalAhorrado, 'USD'),
    },
    {
      key: 'cantidadCuentas',
      header: 'Cuentas',
      numeric: true,
      render: (socio) => formatNumber(socio.cantidadCuentas),
    },
    {
      key: 'acciones',
      header: 'Acciones',
      render: (socio) => (
        <TableActions>
          <TableActionButton type="button" onClick={() => setSeleccionado(socio)}>
            Ver cuentas
          </TableActionButton>
          <TableActionButton type="button" onClick={() => abrirEditarUsuario(socio)}>
            Editar
          </TableActionButton>
          <TableActionButton type="button" onClick={() => void cambiarEstadoUsuario(socio)}>
            {socio.estado === 'inactivo' ? 'Activar' : 'Desactivar'}
          </TableActionButton>
        </TableActions>
      ),
    },
  ];

  const cuentaColumns: TableColumn<CuentaSocioAdmin>[] = [
    {
      key: 'nombre',
      header: 'Cuenta',
      render: (cuenta) => (
        <div className="min-w-[12rem]">
          <p className="font-medium text-slate-900">{cuenta.nombre}</p>
          <p className="font-mono text-[11px] text-slate-500">{cuenta.numeroCuenta}</p>
        </div>
      ),
    },
    { key: 'tipo', header: 'Tipo' },
    {
      key: 'estado',
      header: 'Estado',
      render: (cuenta) => <StatusBadge status={cuenta.estado} />,
    },
    {
      key: 'saldo',
      header: 'Saldo',
      numeric: true,
      render: (cuenta) => formatCurrency(cuenta.saldo, cuenta.moneda || 'USD'),
    },
    {
      key: 'saldoDisponible',
      header: 'Disponible',
      numeric: true,
      render: (cuenta) => formatCurrency(cuenta.saldoDisponible, cuenta.moneda || 'USD'),
    },
    {
      key: 'totalAhorrado',
      header: 'Ahorrado',
      numeric: true,
      render: (cuenta) => formatCurrency(cuenta.totalAhorrado, cuenta.moneda || 'USD'),
    },
    {
      key: 'fechaApertura',
      header: 'Apertura',
      render: (cuenta) => formatDate(cuenta.fechaApertura),
    },
  ];

  return (
    <div className="flex min-h-[calc(100dvh-14rem)] flex-col gap-4">
      <section className="rounded-lg border border-slate-200 bg-white">
        <div className="flex justify-end border-b border-slate-100 p-4">
          <ActionButton type="button" onClick={abrirCrearUsuario}>
            + Crear usuario
          </ActionButton>
        </div>
        <div className="grid gap-3 border-b border-slate-100 p-4 lg:grid-cols-4">
          <div className="lg:col-span-2">
            <label htmlFor="socios-q" className="mb-1 block text-xs font-medium text-slate-600">
              Busqueda general
            </label>
            <Input
              id="socios-q"
              value={draftFilters.q}
              onChange={(event) => setDraftFilters((current) => ({ ...current, q: event.target.value }))}
              placeholder="Nombre, codigo, correo o identificacion"
            />
          </div>

          <div>
            <label htmlFor="socios-estado" className="mb-1 block text-xs font-medium text-slate-600">
              Estado socio
            </label>
            <Select
              id="socios-estado"
              value={draftFilters.estado}
              onChange={(event) => setDraftFilters((current) => ({
                ...current,
                estado: event.target.value as EstadoSocioAdmin | '',
              }))}
            >
              <option value="">Todos</option>
              <option value="activo">Activo</option>
              <option value="inactivo">Inactivo</option>
              <option value="pendiente">Pendiente</option>
            </Select>
          </div>

          <div>
            <label htmlFor="socios-cuenta-estado" className="mb-1 block text-xs font-medium text-slate-600">
              Estado cuenta
            </label>
            <Select
              id="socios-cuenta-estado"
              value={draftFilters.cuentaEstado}
              onChange={(event) => setDraftFilters((current) => ({
                ...current,
                cuentaEstado: event.target.value as EstadoCuentaAhorroAdmin | '',
              }))}
            >
              <option value="">Todas</option>
              <option value="activa">Activa</option>
              <option value="cerrada">Cerrada</option>
              <option value="inactiva">Inactiva</option>
              <option value="bloqueada">Bloqueada</option>
            </Select>
          </div>

          <Input
            aria-label="Codigo"
            value={draftFilters.codigo}
            onChange={(event) => setDraftFilters((current) => ({ ...current, codigo: event.target.value }))}
            placeholder="Codigo"
          />
          <Input
            aria-label="Nombre"
            value={draftFilters.nombre}
            onChange={(event) => setDraftFilters((current) => ({ ...current, nombre: event.target.value }))}
            placeholder="Nombre"
          />
          <Input
            aria-label="Email"
            type="email"
            value={draftFilters.email}
            onChange={(event) => setDraftFilters((current) => ({ ...current, email: event.target.value }))}
            placeholder="Email"
          />
          <Input
            aria-label="Identificacion"
            value={draftFilters.identification}
            onChange={(event) => setDraftFilters((current) => ({
              ...current,
              identification: event.target.value,
            }))}
            placeholder="Identificacion"
          />
          <Select
            aria-label="Rol"
            value={draftFilters.roleCode}
            onChange={(event) => setDraftFilters((current) => ({
              ...current,
              roleCode: event.target.value as RoleCodeAdmin | '',
            }))}
          >
            <option value="">Todos los roles</option>
            <option value="ADMIN">Administrador</option>
            <option value="CUSTOMER">Cliente</option>
            <option value="ACCOUNTANT">Contador</option>
          </Select>

          <div className="flex flex-wrap items-center gap-2 lg:col-span-4">
            <ActionButton
              type="button"
              variant="outline"
              onClick={aplicarFiltros}
              disabled={cargando}
              icon={<NavIcon name="search" size={15} />}
            >
              Consultar
            </ActionButton>
            <ActionButton
              type="button"
              variant="outline"
              onClick={() => void recargar()}
              disabled={cargando}
              icon={<NavIcon name="refresh" size={15} />}
            >
              Recargar
            </ActionButton>
            <ActionButton type="button" variant="ghost" onClick={limpiarFiltros} disabled={cargando}>
              Limpiar
            </ActionButton>
            <p className="ml-auto text-xs text-slate-500">
              {cargando
                ? 'Cargando socios...'
                : error
                  ? error
                  : `${formatNumber(meta.total)} socio(s) encontrados`}
            </p>
          </div>
        </div>

        <Table
          columns={socioColumns}
          data={socios}
          emptyMessage={error ?? 'No hay socios con los filtros seleccionados.'}
        />
      </section>

      <div className="flex flex-col gap-3 rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm sm:flex-row sm:items-center sm:justify-between">
        <p className="text-slate-600">
          Pagina {formatNumber(meta.page)} de {formatNumber(meta.totalPages)} - limite {formatNumber(meta.limit)}
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
        isOpen={Boolean(seleccionado)}
        onClose={() => setSeleccionado(null)}
        title="Cuentas del socio"
        size="lg"
      >
        {seleccionado && (
          <div className="flex flex-col gap-4">
            <div className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3">
              <p className="font-semibold text-slate-900">{seleccionado.fullName}</p>
              <p className="mt-1 text-sm text-slate-600">
                {seleccionado.email} - {seleccionado.identification}
              </p>
              <p className="mt-2 text-sm text-slate-600">
                Total ahorrado: <strong>{formatCurrency(seleccionado.totalAhorrado, 'USD')}</strong>
              </p>
            </div>

            <Table
              columns={cuentaColumns}
              data={seleccionado.cuentas}
              emptyMessage="Este socio no tiene cuentas registradas."
            />
          </div>
        )}
      </Modal>

      <Modal
        isOpen={modalUsuario !== false}
        onClose={() => setModalUsuario(false)}
        title={modalUsuario ? 'Editar socio' : 'Crear usuario'}
      >
        <div className="space-y-4">
          <FormField label="Nombre completo" htmlFor="socio-full-name" required>
            <Input id="socio-full-name" value={formUsuario.fullName} onChange={(event) => setFormUsuario({ ...formUsuario, fullName: event.target.value })} />
          </FormField>
          <FormField label="Identificación" htmlFor="socio-identification" required>
            <Input id="socio-identification" value={formUsuario.identification} onChange={(event) => setFormUsuario({ ...formUsuario, identification: event.target.value })} />
          </FormField>
          <FormField label="Correo" htmlFor="socio-email" required>
            <Input id="socio-email" type="email" value={formUsuario.email} onChange={(event) => setFormUsuario({ ...formUsuario, email: event.target.value })} />
          </FormField>
          <FormField label="Teléfono" htmlFor="socio-phone" required>
            <Input id="socio-phone" value={formUsuario.phoneNumber} onChange={(event) => setFormUsuario({ ...formUsuario, phoneNumber: event.target.value })} />
          </FormField>
          {!modalUsuario && (
            <FormField label="Dirección" htmlFor="socio-address" required>
              <Input
                id="socio-address"
                value={formUsuario.address}
                onChange={(event) => setFormUsuario({ ...formUsuario, address: event.target.value })}
                placeholder="Calle, número, ciudad"
              />
            </FormField>
          )}
          {!modalUsuario && (
            <FormField label="Contraseña inicial" htmlFor="socio-password" required>
              <Input id="socio-password" type="password" value={formUsuario.password} onChange={(event) => setFormUsuario({ ...formUsuario, password: event.target.value })} />
            </FormField>
          )}
          {!modalUsuario && (
            <FormField label="Rol" htmlFor="socio-role" required>
              <Select
                id="socio-role"
                value={formUsuario.roleCode}
                onChange={(event) => setFormUsuario({
                  ...formUsuario,
                  roleCode: event.target.value as RoleCode,
                })}
              >
                <option value="ADMIN">Administrador</option>
                <option value="CUSTOMER">Cliente</option>
                <option value="ACCOUNTANT">Contador</option>
              </Select>
            </FormField>
          )}
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => setModalUsuario(false)}>Cancelar</Button>
            <ActionButton type="button" onClick={() => void guardarUsuario()}>{modalUsuario ? 'Guardar' : 'Crear'}</ActionButton>
          </div>
        </div>
      </Modal>
    </div>
  );
}

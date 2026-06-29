import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ActionButton } from '@shared/ui/atoms/ActionButton';
import { useCuentaActiva } from '@shared/hooks/useCuentaActiva';
import { useToast } from '@shared/hooks/useToast';
import { ROUTES } from '@shared/config/routes';
import type { CuentaUsuario } from '@shared/data/ahorroMockData';
import { isAxiosError } from 'axios';
import { useResumenAhorro } from '../../application/hooks/useResumenAhorro';
import { useCrearCuenta } from '../../application/hooks/useCrearCuenta';
import { cuentaResumenToCuentaUsuario } from '../../infrastructure/mappers/cuenta.mapper';
import type { CrearCuentaInput, CuentaResumen } from '../../domain/cuenta.entity';
import { CrearCuentaForm } from '../components/CrearCuentaForm';
import { CuentaResumenCard } from '../components/CuentaResumenCard';
import { Modal } from '@shared/ui/molecules/Modal';

function mapearCuentas(cuentas: CuentaResumen[]): CuentaUsuario[] {
  return cuentas.map((c, i) => cuentaResumenToCuentaUsuario(c, i));
}

function getCrearErrorMessage(error: unknown): string {
  if (isAxiosError(error)) {
    const msg = error.response?.data as { message?: string } | undefined;
    if (msg?.message) return msg.message;
  }
  return 'No se pudo crear la cuenta. Inténtalo de nuevo.';
}

export function ElegirCuentaView() {
  const navigate = useNavigate();
  const toast = useToast();
  const { seleccionarCuenta, setCuentas, cuentaActivaId } = useCuentaActiva();
  const { resumen, cuentas, cargando, error, recargar } = useResumenAhorro();
  const { crearCuenta, isSubmitting } = useCrearCuenta();
  const [mostrarFormulario, setMostrarFormulario] = useState(false);

  const entrarACuenta = (id: string) => {
    setCuentas(mapearCuentas(cuentas));
    seleccionarCuenta(id);
    navigate(ROUTES.DASHBOARD);
  };

  const onCrearCuenta = async (input: CrearCuentaInput) => {
    try {
      const creada = await crearCuenta(input);
      toast.success(`Cuenta "${creada.nombre}" creada correctamente.`);
      setMostrarFormulario(false);
      const actualizado = await recargar();
      setCuentas(mapearCuentas(actualizado?.cuentas ?? cuentas));
      seleccionarCuenta(creada.idCuenta);
      navigate(ROUTES.DASHBOARD);
    } catch (err) {
      toast.error(getCrearErrorMessage(err));
    }
  };

  return (
    <div className="flex flex-col gap-8">
      <div className="text-center md:text-left">
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900 md:text-3xl">
          ¿Con qué cuenta quieres ahorrar hoy?
        </h1>
        <p className="mt-2 text-sm text-slate-500 md:text-base">
          {resumen
            ? `Meta mensual de ${resumen.metaMensual} USD. Solo los aportes verificados suman al saldo disponible.`
            : 'Cargando tu información de ahorro…'}
        </p>
      </div>

      {cargando ? (
        <p className="py-12 text-center text-sm text-slate-500">Cargando tus cuentas…</p>
      ) : error ? (
        <div className="flex flex-col items-center gap-3 py-12 text-center">
          <p className="text-sm text-red-600">{error}</p>
          <ActionButton type="button" variant="outline" onClick={() => void recargar()}>
            Reintentar
          </ActionButton>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {cuentas.map((cuenta) => (
            <CuentaResumenCard
              key={cuenta.cuentaId}
              cuenta={cuenta}
              esActiva={cuenta.cuentaId === cuentaActivaId}
              onSelect={() => entrarACuenta(cuenta.cuentaId)}
            />
          ))}

          <button
            type="button"
            onClick={() => setMostrarFormulario(true)}
            className="flex min-h-[200px] flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 bg-white p-5 text-slate-500 motion-safe-transition hover:border-emerald-300 hover:bg-emerald-50/40 hover:text-emerald-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
          >
            <span className="mb-2 flex h-10 w-10 items-center justify-center rounded-xl bg-slate-50 text-emerald-600 ring-1 ring-slate-100">
              <span className="text-2xl leading-none">+</span>
            </span>
            <span className="text-sm font-medium">Crear nueva cuenta</span>
          </button>
        </div>
      )}

      <Modal
        isOpen={mostrarFormulario}
        onClose={() => setMostrarFormulario(false)}
        title="Nueva cuenta de ahorro"
      >
        <p className="mb-4 text-sm text-slate-500">
          Personaliza tu nueva cuenta para identificar tu objetivo de ahorro.
        </p>
        <CrearCuentaForm
          onSubmit={onCrearCuenta}
          onCancel={() => setMostrarFormulario(false)}
          isSubmitting={isSubmitting}
        />
      </Modal>
    </div>
  );
}

import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ActionButton } from '@shared/ui/atoms/ActionButton';
import { Input } from '@shared/ui/atoms/Input';
import { FormField } from '@shared/ui/molecules/FormField';
import { useCuentaActiva } from '@shared/hooks/useCuentaActiva';
import { useToast } from '@shared/hooks/useToast';
import { ROUTES } from '@shared/config/routes';
import { META_AHORRO_MENSUAL_DEFAULT, type CuentaUsuario } from '@shared/data/ahorroMockData';
import { SocioCard } from '@features/ahorro/presentation/components/SocioCard';
import { usePagosAhorro } from '@features/ahorro/application/hooks/usePagosAhorro';
import { calcularResumenAhorro } from '@features/ahorro/domain/pago.rules';
import { META_MENSUAL_OBLIGATORIA } from '@features/ahorro/domain/pago.entity';

export function ElegirCuentaView() {
  const navigate = useNavigate();
  const toast = useToast();
  const { cuentas, seleccionarCuenta, agregarCuenta, cuentaActivaId } = useCuentaActiva();
  const { pagos, cargando } = usePagosAhorro();
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [nombreNueva, setNombreNueva] = useState('');

  const resumenesPorCuenta = useMemo(() => {
    const map = new Map<string, ReturnType<typeof calcularResumenAhorro>>();
    for (const cuenta of cuentas) {
      const pagosCuenta = pagos.filter((p) => p.cuentaId === cuenta.id);
      map.set(cuenta.id, calcularResumenAhorro(pagosCuenta));
    }
    return map;
  }, [cuentas, pagos]);

  const entrarACuenta = (id: string) => {
    seleccionarCuenta(id);
    navigate(ROUTES.DASHBOARD);
  };

  const crearCuenta = () => {
    if (!nombreNueva.trim()) {
      toast.error('Escribe un nombre para tu cuenta.');
      return;
    }
    const nueva: CuentaUsuario = {
      id: `cta-${Date.now()}`,
      nombre: nombreNueva.trim(),
      numeroCuenta: `AH-2026-${String(Math.floor(Math.random() * 900000) + 100000)}`,
      saldo: 0,
      totalAhorrado: 0,
      metaMensual: META_AHORRO_MENSUAL_DEFAULT,
      color: 'emerald',
      icono: 'savings',
      fechaApertura: new Date().toISOString().split('T')[0],
      estado: 'activa',
    };
    agregarCuenta(nueva);
    toast.success(`Cuenta "${nueva.nombre}" creada.`);
    setNombreNueva('');
    setMostrarFormulario(false);
    navigate(ROUTES.DASHBOARD);
  };

  return (
    <div className="flex flex-col gap-8">
      <div className="text-center md:text-left">
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900 md:text-3xl">
          ¿Con qué cuenta quieres ahorrar hoy?
        </h1>
        <p className="mt-2 text-sm text-slate-500 md:text-base">
          Meta mensual obligatoria de {META_MENSUAL_OBLIGATORIA} USD por socio.
          Solo los pagos verificados por el contador suman al saldo disponible.
        </p>
      </div>

      {cargando ? (
        <p className="py-12 text-center text-sm text-slate-500">Cargando cuentas y pagos…</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {cuentas.map((cuenta) => (
            <SocioCard
              key={cuenta.id}
              cuenta={cuenta}
              resumen={resumenesPorCuenta.get(cuenta.id) ?? calcularResumenAhorro([])}
              esActiva={cuenta.id === cuentaActivaId}
              onSelect={() => entrarACuenta(cuenta.id)}
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

      {mostrarFormulario && (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-900">Nueva cuenta de ahorro</h3>
          <p className="mt-1 text-sm text-slate-500">
            Dale un nombre para identificar tu objetivo de ahorro.
          </p>
          <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-end">
            <div className="flex-1">
              <FormField label="Nombre de la cuenta" htmlFor="nombre-cuenta" required>
                <Input
                  id="nombre-cuenta"
                  placeholder="Ej. Ahorro para casa, Educación…"
                  value={nombreNueva}
                  onChange={(e) => setNombreNueva(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && crearCuenta()}
                />
              </FormField>
            </div>
            <div className="flex gap-2">
              <ActionButton type="button" variant="outline" onClick={() => setMostrarFormulario(false)}>
                Cancelar
              </ActionButton>
              <ActionButton type="button" onClick={crearCuenta}>
                Crear y abrir
              </ActionButton>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

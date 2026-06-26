import { useCuentaActivaStore } from './useCuentaActivaStore';

export function useCuentaActiva() {
  const cuentaActivaId = useCuentaActivaStore((s) => s.cuentaActivaId);
  const cuentas = useCuentaActivaStore((s) => s.cuentas);
  const seleccionarCuenta = useCuentaActivaStore((s) => s.seleccionarCuenta);
  const limpiarCuenta = useCuentaActivaStore((s) => s.limpiarCuenta);
  const agregarCuenta = useCuentaActivaStore((s) => s.agregarCuenta);
  const getCuentaActiva = useCuentaActivaStore((s) => s.getCuentaActiva);

  const cuentaActiva = cuentaActivaId
    ? cuentas.find((c) => c.id === cuentaActivaId) ?? null
    : null;

  return {
    cuentaActiva,
    cuentaActivaId,
    cuentas,
    tieneCuentaSeleccionada: Boolean(cuentaActivaId),
    seleccionarCuenta,
    limpiarCuenta,
    agregarCuenta,
    getCuentaActiva,
  };
}

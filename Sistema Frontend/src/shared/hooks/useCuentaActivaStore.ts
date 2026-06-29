import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { CuentaUsuario } from '@shared/data/ahorroMockData';
import { MOCK_CUENTAS_USUARIO } from '@shared/data/ahorroMockData';

const STORAGE_KEY = 'cuenta_activa';

interface CuentaActivaState {
  cuentaActivaId: string | null;
  cuentas: CuentaUsuario[];
  seleccionarCuenta: (id: string) => void;
  limpiarCuenta: () => void;
  agregarCuenta: (cuenta: CuentaUsuario) => void;
  /** Reemplaza la lista de cuentas (p. ej. tras cargarlas desde el backend). */
  setCuentas: (cuentas: CuentaUsuario[]) => void;
  getCuentaActiva: () => CuentaUsuario | null;
}

export const useCuentaActivaStore = create<CuentaActivaState>()(
  persist(
    (set, get) => ({
      cuentaActivaId: null,
      cuentas: MOCK_CUENTAS_USUARIO,
      seleccionarCuenta: (id) => set({ cuentaActivaId: id }),
      limpiarCuenta: () => set({ cuentaActivaId: null }),
      agregarCuenta: (cuenta) =>
        set((state) => ({
          cuentas: [...state.cuentas, cuenta],
          cuentaActivaId: cuenta.id,
        })),
      setCuentas: (cuentas) =>
        set((state) => ({
          cuentas,
          cuentaActivaId:
            state.cuentaActivaId && cuentas.some((c) => c.id === state.cuentaActivaId)
              ? state.cuentaActivaId
              : null,
        })),
      getCuentaActiva: () => {
        const { cuentaActivaId, cuentas } = get();
        if (!cuentaActivaId) return null;
        return cuentas.find((c) => c.id === cuentaActivaId) ?? null;
      },
    }),
    {
      name: STORAGE_KEY,
      partialize: (state) => ({
        cuentaActivaId: state.cuentaActivaId,
        cuentas: state.cuentas,
      }),
    },
  ),
);

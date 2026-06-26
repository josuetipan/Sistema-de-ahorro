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

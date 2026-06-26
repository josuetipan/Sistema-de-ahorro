import { useEffect, useState, type ReactNode } from 'react';
import { useAuthStore } from '../hooks/useAuthStore';

interface AuthHydrationGateProps {
  children: ReactNode;
}

/** Espera a que Zustand restaure la sesión antes de evaluar rutas protegidas. */
export function AuthHydrationGate({ children }: AuthHydrationGateProps) {
  const [hydrated, setHydrated] = useState(() => useAuthStore.persist.hasHydrated());

  useEffect(() => {
    const unsub = useAuthStore.persist.onFinishHydration(() => setHydrated(true));
    setHydrated(useAuthStore.persist.hasHydrated());
    return unsub;
  }, []);

  if (!hydrated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950">
        <p className="text-sm text-slate-400">Cargando sesión…</p>
      </div>
    );
  }

  return children;
}

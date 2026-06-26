// Proveedores globales: React Query, React Router y contexto de la app
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';
import { type ReactNode, useState } from 'react';
import { AuthHydrationGate } from '@features/auth/presentation/components/AuthHydrationGate';
import { ToastProvider } from './ToastProvider';

interface AppProvidersProps {
  children: ReactNode;
}

export function AppProviders({ children }: AppProvidersProps) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000,
            retry: 1,
            refetchOnWindowFocus: false,
          },
        },
      }),
  );

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <ToastProvider>
          <AuthHydrationGate>{children}</AuthHydrationGate>
        </ToastProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

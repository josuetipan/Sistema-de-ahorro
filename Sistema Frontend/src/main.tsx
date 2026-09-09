// Punto de entrada de la aplicación React
import { createRoot } from 'react-dom/client';
import { AppProviders } from '@/app/providers';
import { AppRoutes } from '@/app/routes';
import '@/app/styles/globals.css';

createRoot(document.getElementById('root')!).render(
  <AppProviders>
    <AppRoutes />
  </AppProviders>,
);

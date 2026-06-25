// Widget: pie de página con información legal y copyright
import { env } from '@shared/config/env';

export function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white px-4 py-4 text-center text-sm text-slate-500 sm:px-6">
      © {new Date().getFullYear()} {env.VITE_APP_NAME}. Todos los derechos reservados.
    </footer>
  );
}

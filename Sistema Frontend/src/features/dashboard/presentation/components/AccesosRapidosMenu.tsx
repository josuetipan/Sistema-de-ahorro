import { NavLink } from 'react-router-dom';
import { NavIcon } from '@shared/ui/atoms/NavIcon';
import { ROUTES } from '@shared/config/routes';
import type { NavIconName } from '@shared/ui/atoms/NavIcon';

const ITEMS: { to: string; label: string; icon: NavIconName }[] = [
  { to: ROUTES.PAGOS, label: 'Registrar aporte', icon: 'upload' },
  { to: ROUTES.MIS_AHORROS, label: 'Movimientos', icon: 'savings' },
  { to: ROUTES.CALENDARIO, label: 'Calendario', icon: 'chart' },
  { to: ROUTES.MI_CUENTA, label: 'Mi cuenta', icon: 'account' },
];

export function AccesosRapidosMenu() {
  return (
    <nav
      aria-label="Accesos rápidos"
      className="overflow-x-auto rounded-xl border border-slate-200 bg-white p-1 shadow-xs"
    >
      <ul className="flex min-w-max items-stretch gap-1 sm:min-w-0 sm:w-full">
        {ITEMS.map(({ to, label, icon }) => (
          <li key={to} className="flex-1">
            <NavLink
              to={to}
              className={({ isActive }) =>
                [
                  'flex items-center justify-center gap-2 rounded-lg px-3 py-2.5 text-xs font-medium',
                  'motion-safe-transition whitespace-nowrap',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-1',
                  isActive
                    ? 'bg-emerald-50 text-emerald-700'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900',
                ].join(' ')
              }
            >
              <NavIcon name={icon} size={16} className="shrink-0" />
              <span>{label}</span>
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}

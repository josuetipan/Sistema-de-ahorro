import { ROUTES } from './routes';
import type { NavIconName } from '@shared/ui/atoms/NavIcon';

export interface PageMeta {
  icon: NavIconName;
}

export const PAGE_META: Record<string, PageMeta> = {
  [ROUTES.DASHBOARD]: { icon: 'dashboard' },
  [ROUTES.MI_CUENTA]: { icon: 'account' },
  [ROUTES.MIS_AHORROS]: { icon: 'savings' },
  [ROUTES.PAGOS]: { icon: 'upload' },
  [ROUTES.CALENDARIO]: { icon: 'chart' },
  [ROUTES.INVITAR]: { icon: 'users' },
  [ROUTES.HISTORIAL]: { icon: 'history' },
  [ROUTES.PERFIL]: { icon: 'profile' },
  [ROUTES.ADMIN]: { icon: 'admin' },
  [ROUTES.SHOWCASE]: { icon: 'components' },
};

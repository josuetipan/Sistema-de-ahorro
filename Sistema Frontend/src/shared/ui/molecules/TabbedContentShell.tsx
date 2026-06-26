// Molécula: pestañas horizontales estilo SaaS
import type { ReactNode } from 'react';

export interface TabItem {
  id: string;
  label: string;
  badge?: number;
}

export interface TabbedContentShellProps {
  tabs: TabItem[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
  children: ReactNode;
  ariaLabel?: string;
}

export function TabbedContentShell({
  tabs,
  activeTab,
  onTabChange,
  children,
  ariaLabel = 'Secciones',
}: TabbedContentShellProps) {
  return (
    <div className="section-card-shell overflow-hidden">
      {/* Tab bar */}
      <nav
        className="flex flex-wrap items-end gap-0 border-b border-slate-200 bg-slate-50/50 px-4 pt-1"
        aria-label={ariaLabel}
      >
        {tabs.map((tab) => {
          const active = tab.id === activeTab;
          return (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => onTabChange(tab.id)}
              className={[
                'relative whitespace-nowrap px-4 py-2.5 text-[13px] font-medium motion-safe-transition',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-blue-500',
                active
                  ? 'text-blue-600 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:rounded-t after:bg-blue-600'
                  : 'text-slate-500 hover:text-slate-700',
              ].join(' ')}
            >
              {tab.label}
              {tab.badge != null && (
                <span
                  className={[
                    'ml-2 rounded-full px-1.5 py-0.5 text-xs font-medium tabular-nums',
                    active
                      ? 'bg-blue-50 text-blue-600'
                      : 'bg-slate-100 text-slate-500',
                  ].join(' ')}
                >
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      <div role="tabpanel" className="p-4">
        {children}
      </div>
    </div>
  );
}

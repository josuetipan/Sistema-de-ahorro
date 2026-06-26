// Finnova Design System — Tailwind Config
import type { Config } from 'tailwindcss';

export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans:    ['"Inter"', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['"Inter Tight"', '"Inter"', 'system-ui', 'sans-serif'],
      },
      colors: {
        /* Acento primario — azul corporativo */
        primary: {
          50:  '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
          950: '#172554',
        },
        /* Paleta neutral — slate como base (más fría y profesional que gray) */
        neutral: {
          0:   '#ffffff',
          50:  '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',
          950: '#020617',
        },
        /* Semánticos */
        success: {
          50:  '#f0fdf4',
          100: '#dcfce7',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
        },
        warning: {
          50:  '#fffbeb',
          100: '#fef3c7',
          500: '#f59e0b',
          600: '#d97706',
          700: '#b45309',
        },
        danger: {
          50:  '#fef2f2',
          100: '#fee2e2',
          500: '#ef4444',
          600: '#dc2626',
          700: '#b91c1c',
        },
        /* Pastel tokens (heredados, sin cambios en uso) */
        pastel: {
          blue:   { DEFAULT: '#eff6ff', border: '#dbeafe', ink: '#1e40af' },
          sky:    { DEFAULT: '#f0f9ff', border: '#bae6fd', ink: '#0369a1' },
          mint:   { DEFAULT: '#f0fdf4', border: '#bbf7d0', ink: '#166534' },
          indigo: { DEFAULT: '#eef2ff', border: '#c7d2fe', ink: '#4338ca' },
          amber:  { DEFAULT: '#fffbeb', border: '#fde68a', ink: '#b45309' },
          rose:   { DEFAULT: '#fff1f2', border: '#fecdd3', ink: '#be123c' },
        },
        /* Superficie */
        surface: {
          DEFAULT: '#ffffff',
          muted:   '#f8fafc',
          border:  '#e2e8f0',
        },
        /* Electric — heredado, sin uso nuevo */
        electric: {
          DEFAULT: '#2563eb',
          light:   '#dbeafe',
          dark:    '#1d4ed8',
          deeper:  '#1e40af',
          glow:    'rgba(37, 99, 235, 0.3)',
        },
      },
      borderRadius: {
        sm:  '4px',
        md:  '6px',
        lg:  '8px',
        xl:  '10px',
        '2xl': '12px',
        '3xl': '16px',
        full: '9999px',
      },
      boxShadow: {
        xs:   '0 1px 2px rgb(15 23 42 / 0.04)',
        sm:   '0 1px 3px rgb(15 23 42 / 0.06), 0 1px 2px rgb(15 23 42 / 0.04)',
        md:   '0 4px 6px -1px rgb(15 23 42 / 0.07), 0 2px 4px -1px rgb(15 23 42 / 0.04)',
        lg:   '0 10px 15px -3px rgb(15 23 42 / 0.08), 0 4px 6px -2px rgb(15 23 42 / 0.04)',
        card: '0 1px 3px rgb(15 23 42 / 0.06), 0 1px 2px rgb(15 23 42 / 0.04)',
        nav:  '0 1px 0 0 rgb(30 41 59 / 0.14)',
      },
      transitionProperty: {
        interactive: 'color, background-color, border-color, opacity, transform',
      },
    },
  },
  plugins: [],
} satisfies Config;

// Organismo: tarjeta de autenticación corporativa

import type { ReactNode } from 'react';



export interface AuthCardProps {

  title: string;

  subtitle?: string;

  children: ReactNode;

}



export function AuthCard({ title, subtitle, children }: AuthCardProps) {

  return (

    <div className="w-full rounded-xl border border-primary-100/80 bg-gradient-to-br from-white to-pastel-blue/40 p-8 shadow-[0_4px_24px_rgba(37,99,235,0.08)]">

      <div className="mb-6">

        <h2 className="text-lg font-semibold text-gray-900">{title}</h2>

        {subtitle && <p className="mt-1 text-pretty text-sm text-gray-500">{subtitle}</p>}

      </div>

      {children}

    </div>

  );

}


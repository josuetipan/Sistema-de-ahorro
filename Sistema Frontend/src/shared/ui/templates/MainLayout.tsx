// Plantilla: layout principal genérico con contenedor responsive
import type { ReactNode } from 'react';
import { Navbar } from '@/widgets/navbar';
import { Footer } from '@/widgets/footer';

export interface MainLayoutProps {
  children: ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-8 sm:px-6 lg:px-8">{children}</main>
      <Footer />
    </div>
  );
}

import React from 'react';
import '../globals.css';
import { StoreProvider } from '../context/StoreContext';

export const metadata = {
  title: 'Panisul - Sistema de Gestão',
  description: 'Sistema de gestão ultra-simplificado para fábrica de pães',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>
        <StoreProvider>
          {children}
        </StoreProvider>
      </body>
    </html>
  );
}

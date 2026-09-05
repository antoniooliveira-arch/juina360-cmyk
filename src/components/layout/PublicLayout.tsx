import React from 'react';
import { Header, Footer } from './Header';

export const PublicLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="flex min-h-screen flex-col bg-zinc-50">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
};
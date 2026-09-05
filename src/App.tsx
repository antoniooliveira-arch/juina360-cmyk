import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import React from 'react';
import { AppProvider, useApp } from '@/context/AppContext';
import { ToastProvider } from '@/components/ui/Toast';
import { PublicLayout } from '@/components/layout/PublicLayout';
import { AdminLayout } from '@/components/layout/AdminLayout';
import { Home } from '@/pages/Home';
import { Categoria } from '@/pages/Categoria';
import { Noticia } from '@/pages/Noticia';
import { Login } from '@/pages/Login';
import { DashboardAdmin } from '@/pages/admin/DashboardAdmin';
import { NoticiasAdmin } from '@/pages/admin/NoticiasAdmin';
import { CategoriasAdmin } from '@/pages/admin/CategoriasAdmin';
import { PatrocinadoresAdmin } from '@/pages/admin/PatrocinadoresAdmin';
import { UsuariosAdmin } from '@/pages/admin/UsuariosAdmin';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useApp();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

function AppRoutes() {
  const { isAuthenticated } = useApp();

  return (
    <Routes>
      <Route path="/login" element={isAuthenticated ? <Navigate to="/admin" replace /> : <Login />} />

      <Route path="/" element={<PublicLayout><Home /></PublicLayout>} />
      <Route path="/categoria/:slug" element={<PublicLayout><Categoria /></PublicLayout>} />
      <Route path="/noticia/:slug" element={<PublicLayout><Noticia /></PublicLayout>} />

      <Route path="/admin" element={<ProtectedRoute><AdminLayout><DashboardAdmin /></AdminLayout></ProtectedRoute>} />
      <Route path="/admin/noticias" element={<ProtectedRoute><AdminLayout><NoticiasAdmin /></AdminLayout></ProtectedRoute>} />
      <Route path="/admin/categorias" element={<ProtectedRoute><AdminLayout><CategoriasAdmin /></AdminLayout></ProtectedRoute>} />
      <Route path="/admin/patrocinadores" element={<ProtectedRoute><AdminLayout><PatrocinadoresAdmin /></AdminLayout></ProtectedRoute>} />
      <Route path="/admin/usuarios" element={<ProtectedRoute><AdminLayout><UsuariosAdmin /></AdminLayout></ProtectedRoute>} />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppProvider>
        <ToastProvider>
          <AppRoutes />
        </ToastProvider>
      </AppProvider>
    </BrowserRouter>
  );
}
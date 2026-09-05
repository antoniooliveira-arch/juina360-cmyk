import React from 'react';
import { NavLink, useNavigate, Link, Navigate } from 'react-router-dom';
import { useApp } from '@/context/AppContext';
import {
  LayoutDashboard, Newspaper, Tags, Handshake, Users, LogOut, Globe, Megaphone,
} from 'lucide-react';
import { cn } from '@/lib/cn';

const navItens = [
  { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/admin/noticias', label: 'Notícias', icon: Newspaper },
  { to: '/admin/categorias', label: 'Categorias', icon: Tags },
  { to: '/admin/patrocinadores', label: 'Patrocinadores', icon: Handshake },
  { to: '/admin/campanhas', label: 'Campanhas', icon: Megaphone },
  { to: '/admin/usuarios', label: 'Usuários', icon: Users },
];

export const AdminLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentUser, logout } = useApp();
  const navigate = useNavigate();

  if (currentUser?.perfil === 'patrocinador') return <Navigate to="/painel" replace />;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const iniciais = (currentUser?.nome ?? 'JU')
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map(p => p[0].toUpperCase())
    .join('');

  return (
    <div className="flex min-h-screen bg-slate-100">
      <aside className="fixed inset-y-0 left-0 z-30 flex w-60 flex-col border-r border-slate-800 bg-slate-950">
        <div className="relative flex h-16 items-center gap-2 overflow-hidden border-b border-white/10 px-4">
          <div className="brand-gradient pointer-events-none absolute -top-10 -right-8 h-24 w-24 rounded-full opacity-30 blur-2xl" />
          <span className="brand-gradient relative flex h-9 w-9 items-center justify-center rounded-xl text-xs font-black text-white shadow-lg shadow-amber-500/20">360</span>
          <div className="relative">
            <div className="font-display text-sm font-extrabold text-white">JUINA<span className="text-amber-400">360º</span></div>
            <div className="text-[10px] font-medium uppercase tracking-widest text-zinc-500">Painel de Gestão</div>
          </div>
        </div>
        <nav className="flex-1 space-y-1 px-3 py-4">
          {navItens.map(item => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                cn(
                  'group relative flex items-center gap-3 overflow-hidden rounded-xl px-3 py-2.5 text-sm font-medium transition',
                  isActive
                    ? 'bg-gradient-to-r from-amber-500/15 to-amber-500/5 text-white'
                    : 'text-zinc-400 hover:bg-white/5 hover:text-white'
                )
              }
            >
              {({ isActive }) => (
                <>
                  <span
                    className={cn(
                      'absolute left-0 top-1/2 h-6 -translate-y-1/2 rounded-r-full bg-amber-500 transition-all',
                      isActive ? 'w-1' : 'w-0'
                    )}
                  />
                  <item.icon
                    className={cn('h-[18px] w-[18px] transition', isActive ? 'text-amber-400' : 'group-hover:text-amber-400')}
                  />
                  {item.label}
                </>
              )}
            </NavLink>
          ))}
          <Link
            to="/"
            className="group relative flex items-center gap-3 overflow-hidden rounded-xl px-3 py-2.5 text-sm font-medium text-zinc-400 transition hover:bg-white/5 hover:text-white"
          >
            <Globe className="h-[18px] w-[18px] transition group-hover:text-amber-400" /> Ver site
          </Link>
        </nav>
        <div className="border-t border-white/10 p-4">
          <div className="flex items-center gap-3">
            <span className="brand-gradient flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-black text-white">
              {iniciais}
            </span>
            <div className="min-w-0">
              <div className="truncate text-sm font-semibold text-white">{currentUser?.nome}</div>
              <div className="text-xs capitalize text-zinc-500">{currentUser?.perfil}</div>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-red-500/10 px-3 py-2.5 text-sm font-semibold text-red-400 ring-1 ring-inset ring-red-500/20 transition hover:bg-red-500/20"
          >
            <LogOut className="h-4 w-4" /> Sair
          </button>
        </div>
      </aside>
      <main className="ml-60 flex-1 p-6 md:p-8">
        <div className="animate-fade-in mx-auto max-w-5xl">{children}</div>
      </main>
    </div>
  );
};
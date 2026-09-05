import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useApp } from '@/context/AppContext';
import {
  LayoutDashboard, Newspaper, Tags, Handshake, Users, LogOut, Globe,
} from 'lucide-react';
import { cn } from '@/lib/cn';

const navItens = [
  { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/admin/noticias', label: 'Notícias', icon: Newspaper },
  { to: '/admin/categorias', label: 'Categorias', icon: Tags },
  { to: '/admin/patrocinadores', label: 'Patrocinadores', icon: Handshake },
  { to: '/admin/usuarios', label: 'Usuários', icon: Users },
];

export const AdminLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentUser, logout } = useApp();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="flex min-h-screen bg-zinc-100">
      <aside className="fixed inset-y-0 left-0 z-30 flex w-60 flex-col border-r border-zinc-200 bg-slate-900">
        <div className="flex h-16 items-center gap-2 border-b border-white/10 px-4">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-xs font-bold text-amber-400">360</span>
          <div>
            <div className="text-sm font-black text-white">JUINA<span className="text-amber-400">360º</span></div>
            <div className="text-[10px] uppercase tracking-wide text-zinc-500">Painel de Gestão</div>
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
                  'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition',
                  isActive ? 'bg-white/10 text-white' : 'text-zinc-400 hover:bg-white/5 hover:text-white'
                )
              }
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </NavLink>
          ))}
          <NavLink
            to="/"
            className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-zinc-400 transition hover:bg-white/5 hover:text-white"
          >
            <Globe className="h-4 w-4" /> Ver site
          </NavLink>
        </nav>
        <div className="border-t border-white/10 p-4">
          <div className="text-sm font-semibold text-white">{currentUser?.nome}</div>
          <div className="text-xs capitalize text-zinc-500">{currentUser?.perfil}</div>
          <button
            onClick={handleLogout}
            className="mt-3 flex w-full items-center justify-center gap-2 rounded-md bg-red-500/10 px-3 py-2 text-sm font-semibold text-red-400 transition hover:bg-red-500/20"
          >
            <LogOut className="h-4 w-4" /> Sair
          </button>
        </div>
      </aside>
      <main className="ml-60 flex-1 p-6">{children}</main>
    </div>
  );
};
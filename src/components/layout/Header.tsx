import { Link } from 'react-router-dom';
import { useApp } from '@/context/AppContext';
import { LogIn, Menu, X, LayoutDashboard, Globe } from 'lucide-react';
import { useState } from 'react';

export function Logo() {
  return (
    <Link to="/" className="flex items-center gap-2">
      <span className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-900 text-sm font-bold text-amber-400 ring-2 ring-amber-400/40">
        360
      </span>
      <span className="text-lg font-black tracking-tight text-slate-900">
        JUINA<span className="text-amber-500">360º</span>
      </span>
    </Link>
  );
}

export function Header() {
  const { categorias, isAuthenticated } = useApp();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-zinc-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <Logo />
        <nav className="hidden items-center gap-1 md:flex">
          {categorias.map(cat => (
            <Link
              key={cat.id}
              to={`/categoria/${cat.slug}`}
              className="rounded-md px-3 py-1.5 text-sm font-medium text-zinc-600 transition hover:bg-zinc-100 hover:text-slate-900"
            >
              {cat.nome}
            </Link>
          ))}
        </nav>
        <div className="hidden items-center gap-2 md:flex">
          {isAuthenticated ? (
            <Link
              to="/admin"
              className="flex items-center gap-1.5 rounded-md bg-slate-900 px-3 py-1.5 text-sm font-semibold text-white transition hover:bg-slate-700"
            >
              <LayoutDashboard className="h-4 w-4" /> Painel
            </Link>
          ) : (
            <Link
              to="/login"
              className="flex items-center gap-1.5 rounded-md bg-slate-900 px-3 py-1.5 text-sm font-semibold text-white transition hover:bg-slate-700"
            >
              <LogIn className="h-4 w-4" /> Entrar
            </Link>
          )}
        </div>
        <button onClick={() => setOpen(!open)} className="md:hidden" aria-label="Menu">
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>
      {open && (
        <div className="border-t border-zinc-200 bg-white px-4 py-3 md:hidden">
          <nav className="flex flex-col gap-1">
            {categorias.map(cat => (
              <Link
                key={cat.id}
                to={`/categoria/${cat.slug}`}
                onClick={() => setOpen(false)}
                className="rounded-md px-3 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-100"
              >
                {cat.nome}
              </Link>
            ))}
            <Link
              to={isAuthenticated ? '/admin' : '/login'}
              onClick={() => setOpen(false)}
              className="mt-1 flex items-center gap-1.5 rounded-md bg-slate-900 px-3 py-2 text-sm font-semibold text-white"
            >
              {isAuthenticated ? <LayoutDashboard className="h-4 w-4" /> : <LogIn className="h-4 w-4" />}
              {isAuthenticated ? 'Painel' : 'Entrar'}
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}

export function Footer() {
  const { categorias } = useApp();
  return (
    <footer className="mt-12 border-t border-zinc-200 bg-slate-900 text-zinc-300">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 md:grid-cols-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-xs font-bold text-amber-400">360</span>
            <span className="text-lg font-black text-white">JUINA<span className="text-amber-400">360º</span></span>
          </div>
          <p className="mt-3 text-sm text-zinc-400">Cidade em 360 graus. Informação, cultura e notícias de Juína e região.</p>
        </div>
        <div>
          <h4 className="text-sm font-semibold capitalize text-white">Categorias</h4>
          <ul className="mt-3 space-y-1.5">
            {categorias.map(cat => (
              <li key={cat.id}>
                <Link to={`/categoria/${cat.slug}`} className="text-sm text-zinc-400 hover:text-amber-400">
                  {cat.nome}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="text-sm font-semibold text-white">Veículos</h4>
          <p className="mt-3 flex items-center gap-2 text-sm text-zinc-400">
            <Globe className="h-4 w-4" /> Seguindo Juína em todas as direções
          </p>
        </div>
      </div>
      <div className="border-t border-white/10 py-4 text-center text-xs text-zinc-500">
        © {new Date().getFullYear()} JUINA360º — Todos os direitos reservados
      </div>
    </footer>
  );
}
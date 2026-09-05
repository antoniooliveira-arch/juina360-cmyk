import { Link, NavLink } from 'react-router-dom';
import { useApp } from '@/context/AppContext';
import { LogIn, Menu, X, LayoutDashboard, Globe, Newspaper, Mail, ArrowRight } from 'lucide-react';
import { useState } from 'react';

export function Logo({ escuro = false }: { escuro?: boolean }) {
  return (
    <Link to="/" className="group flex items-center gap-2.5">
      <span className="brand-gradient flex h-10 w-10 items-center justify-center rounded-xl text-sm font-black text-white shadow-lg shadow-amber-500/30 transition duration-300 group-hover:rotate-12">
        360
      </span>
      <span className={`font-display text-xl font-extrabold tracking-tight ${escuro ? 'text-white' : 'text-slate-900'}`}>
        JUINA<span className="brand-gradient bg-clip-text text-transparent">360º</span>
      </span>
    </Link>
  );
}

export function Header() {
  const { categorias, isAuthenticated } = useApp();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40">
      <div className="bg-slate-900 text-zinc-300">
        <div className="mx-auto flex h-8 max-w-7xl items-center justify-between px-4 text-[11px]">
          <span className="flex items-center gap-1.5 font-medium uppercase tracking-wide text-zinc-400">
            <Newspaper className="h-3.5 w-3.5 text-amber-400" />
            Portal de notícias de Juína/MT
          </span>
          <span className="hidden font-medium capitalize text-zinc-400 sm:block">
            {new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
          </span>
        </div>
      </div>
      <div className="border-b border-zinc-200 bg-white/90 shadow-sm backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
          <Logo />
          <nav className="hidden items-center gap-1 lg:flex">
            <NavLink
              to="/"
              end
              className={({ isActive }) =>
                `nav-underline rounded-md px-3 py-2 text-sm font-semibold transition ${
                  isActive ? 'nav-underline-active text-slate-900' : 'text-zinc-600 hover:text-slate-900'
                }`
              }
            >
              Home
            </NavLink>
            {categorias.map(cat => (
              <NavLink
                key={cat.id}
                to={`/categoria/${cat.slug}`}
                className={({ isActive }) =>
                  `nav-underline rounded-md px-3 py-2 text-sm font-semibold transition ${
                    isActive ? 'nav-underline-active text-slate-900' : 'text-zinc-600 hover:text-slate-900'
                  }`
                }
              >
                {cat.nome}
              </NavLink>
            ))}
          </nav>
          <div className="hidden items-center gap-2 lg:flex">
            {isAuthenticated ? (
              <Link
                to="/admin"
                className="flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-md transition hover:-translate-y-0.5 hover:bg-slate-700 hover:shadow-lg"
              >
                <LayoutDashboard className="h-4 w-4" /> Painel
              </Link>
            ) : (
              <Link
                to="/login"
                className="flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-md transition hover:-translate-y-0.5 hover:bg-slate-700 hover:shadow-lg"
              >
                <LogIn className="h-4 w-4" /> Entrar
              </Link>
            )}
          </div>
          <button onClick={() => setOpen(!open)} className="rounded-lg p-2 text-slate-900 hover:bg-zinc-100 lg:hidden" aria-label="Menu">
            {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
        {open && (
          <div className="animate-fade-in border-t border-zinc-200 bg-white px-4 py-4 lg:hidden">
            <nav className="flex flex-col gap-1">
              <Link to="/" onClick={() => setOpen(false)} className="rounded-lg px-3 py-2.5 text-sm font-semibold text-zinc-700 hover:bg-zinc-100">
                Home
              </Link>
              {categorias.map(cat => (
                <Link
                  key={cat.id}
                  to={`/categoria/${cat.slug}`}
                  onClick={() => setOpen(false)}
                  className="rounded-lg px-3 py-2.5 text-sm font-semibold text-zinc-700 hover:bg-zinc-100"
                >
                  {cat.nome}
                </Link>
              ))}
              <Link
                to={isAuthenticated ? '/admin' : '/login'}
                onClick={() => setOpen(false)}
                className="mt-2 flex items-center justify-center gap-2 rounded-lg bg-slate-900 px-3 py-2.5 text-sm font-semibold text-white"
              >
                {isAuthenticated ? <LayoutDashboard className="h-4 w-4" /> : <LogIn className="h-4 w-4" />}
                {isAuthenticated ? 'Painel' : 'Entrar'}
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}

export function Footer() {
  const { categorias } = useApp();
  return (
    <footer className="mt-14">
      <div className="brand-gradient">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 py-6 text-slate-900 sm:flex-row">
          <div className="flex items-center gap-3">
            <Mail className="h-6 w-6" />
            <div>
              <div className="font-display text-lg font-extrabold">Fique por dentro</div>
              <p className="text-sm font-medium opacity-80">As principais notícias de Juína em primeira mão.</p>
            </div>
          </div>
        </div>
      </div>
      <div className="bg-slate-900 text-zinc-300">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 md:grid-cols-3">
          <div>
            <Logo escuro />
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-zinc-400">
              Cidade em 360 graus. Informação, cultura e notícias de Juína e região — sempre em todas as direções.
            </p>
            <div className="mt-5 flex items-center gap-3 text-xs text-zinc-500">
              <Globe className="h-4 w-4 text-amber-400" /> Juína · Mato Grosso · Brasil
            </div>
          </div>
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-white">Categorias</h4>
            <ul className="mt-4 space-y-2">
              {categorias.map(cat => (
                <li key={cat.id}>
                  <Link to={`/categoria/${cat.slug}`} className="group flex w-fit items-center gap-1.5 text-sm text-zinc-400 transition hover:text-amber-400">
                    <ArrowRight className="h-3 w-3 -translate-x-1 text-transparent transition group-hover:translate-x-0 group-hover:text-amber-400" />
                    {cat.nome}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-white">Veículos</h4>
            <p className="mt-4 flex items-center gap-2 text-sm text-zinc-400">
              <Globe className="h-4 w-4 text-amber-400" /> Seguindo Juína em todas as direções
            </p>
            <p className="mt-2 text-sm text-zinc-500">
              Um jornalismo local, ágil e conectado com a cidade.
            </p>
          </div>
        </div>
        <div className="border-t border-white/10 py-5 text-center text-xs text-zinc-500">
          © {new Date().getFullYear()} JUINA360º — Todos os direitos reservados · Feito com <span className="text-amber-400">♥</span> em Juína
        </div>
      </div>
    </footer>
  );
}
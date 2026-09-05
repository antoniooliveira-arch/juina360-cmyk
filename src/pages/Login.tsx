import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useApp } from '@/context/AppContext';
import { Logo } from '@/components/layout/Header';
import { LogIn, Newspaper, ShieldCheck, Mail } from 'lucide-react';

export function Login() {
  const { login } = useApp();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (login(email.trim(), senha)) {
      navigate('/admin');
    } else {
      setErro('Usuário ou senha inválidos. Verifique suas credenciais.');
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-slate-50 lg:flex-row">
      <aside className="relative hidden overflow-hidden bg-slate-950 lg:flex lg:w-1/2 lg:flex-col lg:justify-between">
        <div className="bg-grid pointer-events-none absolute inset-0" />
        <div className="brand-gradient pointer-events-none absolute -right-32 -top-32 h-96 w-96 rounded-full opacity-40 blur-3xl" />
        <header className="relative px-10 py-8">
          <Logo escuro />
        </header>
        <div className="relative px-10 pb-10">
          <span className="brand-gradient animate-pulse-ring flex h-16 w-16 items-center justify-center rounded-2xl shadow-2xl">
            <Newspaper className="h-8 w-8 text-white" />
          </span>
          <h1 className="mt-6 font-display text-4xl font-extrabold leading-tight text-white">
            A cidade em <span className="shimmer-text">360 graus</span>
          </h1>
          <p className="mt-3 max-w-md text-zinc-400">
            Gerencie notícias, categorias, patrocinadores e usuários do portal de notícias de Juína — tudo em um só lugar.
          </p>
          <ul className="mt-8 space-y-3 text-sm text-zinc-400">
            <li className="flex items-center gap-3">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/10">
                <Newspaper className="h-4 w-4 text-amber-400" />
              </span>
              Publique matérias em tempo real
            </li>
            <li className="flex items-center gap-3">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/10">
                <Mail className="h-4 w-4 text-amber-400" />
              </span>
              Anexe fotos, vídeos e músicas
            </li>
            <li className="flex items-center gap-3">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/10">
                <ShieldCheck className="h-4 w-4 text-amber-400" />
              </span>
              Controle de acesso por perfil
            </li>
          </ul>
        </div>
      </aside>

      <header className="flex h-16 items-center justify-center border-b border-zinc-200 bg-white px-4 lg:hidden">
        <Logo />
      </header>

      <main className="flex flex-1 items-center justify-center px-4 py-10">
        <div className="w-full max-w-sm">
          <div className="rounded-3xl border border-zinc-200 bg-white p-8 shadow-xl shadow-slate-900/5">
            <div className="text-center">
              <h2 className="font-display text-2xl font-extrabold text-slate-900">Área do Jornalista</h2>
              <p className="mt-1 text-sm text-zinc-500">Acesse o painel de gestão do JUINA360º</p>
            </div>
            <form onSubmit={handleSubmit} className="mt-7 space-y-4">
              <div>
                <label className="text-sm font-medium text-zinc-700">E-mail</label>
                <input
                  type="email"
                  value={email}
                  onChange={e => { setEmail(e.target.value); setErro(''); }}
                  placeholder="seu@email.com"
                  className="mt-1.5 w-full rounded-xl border border-zinc-300 bg-zinc-50 px-3.5 py-2.5 text-sm outline-none transition focus:border-amber-500 focus:bg-white focus:ring-4 focus:ring-amber-500/15"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-zinc-700">Senha</label>
                <input
                  type="password"
                  value={senha}
                  onChange={e => { setSenha(e.target.value); setErro(''); }}
                  placeholder="••••••"
                  className="mt-1.5 w-full rounded-xl border border-zinc-300 bg-zinc-50 px-3.5 py-2.5 text-sm outline-none transition focus:border-amber-500 focus:bg-white focus:ring-4 focus:ring-amber-500/15"
                />
              </div>
              {erro && (
                <p className="rounded-xl bg-red-50 px-3.5 py-2.5 text-sm text-red-600 ring-1 ring-red-100">{erro}</p>
              )}
              <button
                type="submit"
                className="brand-gradient flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-bold text-white shadow-lg shadow-amber-500/30 transition hover:-translate-y-0.5 hover:shadow-xl"
              >
                <LogIn className="h-4 w-4" /> Entrar no painel
              </button>
            </form>
          </div>
          <p className="mt-5 text-center text-xs text-zinc-500">
            <Link to="/" className="font-bold text-amber-600 hover:underline">← Voltar ao site</Link>
          </p>
        </div>
      </main>
    </div>
  );
}
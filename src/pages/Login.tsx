import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useApp } from '@/context/AppContext';
import { Logo } from '@/components/layout/Header';
import { LogIn } from 'lucide-react';

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
    <div className="flex min-h-screen flex-col bg-zinc-50">
      <header className="flex h-16 items-center border-b border-zinc-200 bg-white px-4">
        <Logo />
      </header>
      <main className="flex flex-1 items-center justify-center px-4">
        <div className="w-full max-w-sm">
          <div className="rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm">
            <div className="text-center">
              <h1 className="text-2xl font-black text-slate-900">Área do Jornalista</h1>
              <p className="mt-1 text-sm text-zinc-500">Acesse o painel de gestão do JUINA360º</p>
            </div>
            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <div>
                <label className="text-sm font-medium text-zinc-700">E-mail</label>
                <input
                  type="email"
                  value={email}
                  onChange={e => { setEmail(e.target.value); setErro(''); }}
                  placeholder="seu@email.com"
                  className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm outline-none transition focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-zinc-700">Senha</label>
                <input
                  type="password"
                  value={senha}
                  onChange={e => { setSenha(e.target.value); setErro(''); }}
                  placeholder="••••••"
                  className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm outline-none transition focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20"
                />
              </div>
              {erro && (
                <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{erro}</p>
              )}
              <button
                type="submit"
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-700"
              >
                <LogIn className="h-4 w-4" /> Entrar
              </button>
            </form>
          </div>
          <p className="mt-4 text-center text-xs text-zinc-500">
            <Link to="/" className="font-medium text-amber-600 hover:underline">← Voltar ao site</Link>
          </p>
        </div>
      </main>
    </div>
  );
}
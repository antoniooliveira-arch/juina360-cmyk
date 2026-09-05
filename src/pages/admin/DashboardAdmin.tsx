import { useApp } from '@/context/AppContext';
import { Newspaper, Eye, FileText, Tags, Handshake } from 'lucide-react';
import { Link } from 'react-router-dom';

export function DashboardAdmin() {
  const { noticias, categorias, patrocinadores, currentUser } = useApp();
  const publicadas = noticias.filter(n => n.status === 'publicado');
  const rascunhos = noticias.filter(n => n.status === 'rascunho');
  const viewsTotal = noticias.reduce((acc, n) => acc + n.views, 0);
  const ativos = patrocinadores.filter(p => p.ativo);

  const stats = [
    { label: 'Notícias publicadas', valor: publicadas.length, icon: Newspaper, cor: 'text-emerald-600 bg-emerald-50' },
    { label: 'Rascunhos', valor: rascunhos.length, icon: FileText, cor: 'text-amber-600 bg-amber-50' },
    { label: 'Visualizações', valor: viewsTotal, icon: Eye, cor: 'text-blue-600 bg-blue-50' },
    { label: 'Categorias', valor: categorias.length, icon: Tags, cor: 'text-purple-600 bg-purple-50' },
  ];

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-slate-900">Painel de Controle</h1>
          <p className="text-sm text-zinc-500">Bem-vindo(a), {currentUser?.nome}</p>
        </div>
        <Link
          to="/admin/noticias"
          className="rounded-lg bg-amber-500 px-4 py-2 text-sm font-semibold text-slate-900 transition hover:bg-amber-400"
        >
          + Nova notícia
        </Link>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map(s => (
          <div key={s.label} className="rounded-xl border border-zinc-200 bg-white p-5">
            <div className={`inline-flex rounded-lg p-2 ${s.cor}`}>
              <s.icon className="h-5 w-5" />
            </div>
            <div className="mt-3 text-3xl font-black text-slate-900">{s.valor}</div>
            <div className="text-sm text-zinc-500">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-zinc-200 bg-white p-5">
          <h2 className="flex items-center gap-2 text-lg font-bold text-slate-900">
            <Handshake className="h-5 w-5 text-amber-500" /> Patrocinadores
          </h2>
          <div className="mt-2 text-sm text-zinc-600">
            <span className="text-2xl font-black text-slate-900">{ativos.length}</span> ativos de {patrocinadores.length} cadastrados
          </div>
          <Link to="/admin/patrocinadores" className="mt-3 inline-block text-sm font-semibold text-amber-600 hover:underline">
            Gerenciar patrocinadores →
          </Link>
        </div>

        <div className="rounded-xl border border-zinc-200 bg-white p-5">
          <h2 className="flex items-center gap-2 text-lg font-bold text-slate-900">
            <Newspaper className="h-5 w-5 text-amber-500" /> Últimas notícias
          </h2>
          {publicadas.length === 0 ? (
            <p className="mt-3 text-sm text-zinc-500">Nenhuma notícia publicada ainda.</p>
          ) : (
            <ul className="mt-3 divide-y divide-zinc-100">
              {publicadas.slice(0, 5).map(n => (
                <li key={n.id} className="flex items-center justify-between gap-3 py-2.5">
                  <span className="truncate text-sm text-zinc-700">{n.titulo}</span>
                  <span className="shrink-0 text-xs text-zinc-400">{n.views} views</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
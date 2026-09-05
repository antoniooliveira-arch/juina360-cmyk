import { useApp } from '@/context/AppContext';
import { NoticiaCard } from '@/components/noticias/NoticiaCard';
import { useParams, Link } from 'react-router-dom';
import { SearchX, Home as HomeIcon, ChevronRight } from 'lucide-react';
import { Reveal } from '@/components/Reveal';

export function Categoria() {
  const { slug } = useParams<{ slug: string }>();
  const { noticias, categorias } = useApp();
  const categoria = categorias.find(c => c.slug === slug);
  const lista = noticias.filter(n => n.status === 'publicado' && n.categoriaId === categoria?.id);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <div className="rounded-2xl border border-zinc-200 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 p-6 relative overflow-hidden md:p-8">
        <div className="bg-grid pointer-events-none absolute inset-0" />
        <nav className="relative flex items-center gap-1 text-sm text-zinc-400">
          <Link to="/" className="flex items-center gap-1 hover:text-amber-400">
            <HomeIcon className="h-3.5 w-3.5" /> Home
          </Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <span className="font-semibold text-amber-400">{categoria?.nome ?? slug}</span>
        </nav>
        <div className="relative mt-4 flex items-center gap-4">
          <span className="brand-gradient flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl shadow-lg shadow-amber-500/30">
            <span className="text-xl font-black text-white">360</span>
          </span>
          <div>
            <h1 className="font-display text-3xl font-extrabold text-white md:text-4xl">{categoria?.nome ?? 'Categoria'}</h1>
            {lista.length > 0 && (
              <p className="mt-1 text-sm text-zinc-400">{lista.length} {lista.length === 1 ? 'notícia publicada' : 'notícias publicadas'}</p>
            )}
          </div>
        </div>
      </div>

      {lista.length ? (
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {lista.map((n, i) => (
            <Reveal key={n.id} delay={(i % 3) * 90}>
              <NoticiaCard noticia={n} />
            </Reveal>
          ))}
        </div>
      ) : (
        <Reveal>
          <div className="mt-8 flex flex-col items-center justify-center rounded-3xl border border-dashed border-zinc-300 bg-white py-16 text-center">
            <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-zinc-100">
              <SearchX className="h-7 w-7 text-zinc-400" />
            </span>
            <p className="mt-4 text-sm text-zinc-600">Nenhuma notícia publicada nesta categoria ainda.</p>
            <Link to="/" className="mt-4 rounded-lg bg-amber-500 px-4 py-2 text-sm font-bold text-slate-900 transition hover:bg-amber-400">
              Ver últimas notícias →
            </Link>
          </div>
        </Reveal>
      )}
    </div>
  );
}
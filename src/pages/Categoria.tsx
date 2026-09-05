import { useApp } from '@/context/AppContext';
import { NoticiaCard } from '@/components/noticias/NoticiaCard';
import { useParams, Link } from 'react-router-dom';
import { SearchX } from 'lucide-react';

export function Categoria() {
  const { slug } = useParams<{ slug: string }>();
  const { noticias, categorias } = useApp();
  const categoria = categorias.find(c => c.slug === slug);
  const lista = noticias.filter(n => n.status === 'publicado' && n.categoriaId === categoria?.id);

  return (
    <div className="mx-auto max-w-6xl px-4 py-6">
      <nav className="text-sm text-zinc-500">
        <Link to="/" className="hover:text-amber-600">Home</Link>
        <span className="mx-2">/</span>
        <span className="font-semibold text-slate-900">{categoria?.nome ?? slug}</span>
      </nav>
      <h1 className="mt-3 text-3xl font-black text-slate-900">{categoria?.nome ?? 'Categoria'}</h1>

      {lista.length ? (
        <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {lista.map(n => (
            <NoticiaCard key={n.id} noticia={n} />
          ))}
        </div>
      ) : (
        <div className="mt-6 flex flex-col items-center justify-center rounded-2xl border border-dashed border-zinc-300 bg-white py-16 text-center">
          <SearchX className="h-10 w-10 text-zinc-300" />
          <p className="mt-3 text-sm text-zinc-600">Nenhuma notícia publicada nesta categoria.</p>
        </div>
      )}
    </div>
  );
}
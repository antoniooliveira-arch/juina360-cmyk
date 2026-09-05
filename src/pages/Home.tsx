import { useApp } from '@/context/AppContext';
import { NoticiaCard } from '@/components/noticias/NoticiaCard';
import { PatrocinadoresDestaque } from '@/components/patrocinadores/PatrocinadoresDestaque';
import { Newspaper } from 'lucide-react';

export function Home() {
  const { noticias, patrocinadores } = useApp();
  const publicadas = noticias.filter(n => n.status === 'publicado');
  const destaque = publicadas.find(n => n.destaque) ?? publicadas[0];
  const demais = publicadas.filter(n => n.id !== destaque?.id);

  return (
    <div>
      <div className="border-b border-zinc-200 bg-white">
        <div className="mx-auto flex h-10 max-w-6xl items-center gap-2 px-4 text-sm">
          <Newspaper className="h-4 w-4 text-amber-500" />
          <span className="font-semibold text-slate-900">Notícias de Juína em tempo real</span>
          <span className="ml-auto hidden text-xs text-zinc-500 sm:block">
            {new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
          </span>
        </div>
      </div>

      {(patrocinadores.length > 0 || !(import.meta.env.VITE_SUPABASE_URL)) && (
        <PatrocinadoresDestaque />
      )}

      <div className="mx-auto max-w-6xl px-4 py-6">
        {destaque ? (
          <>
            <div className="grid gap-6 lg:grid-cols-2">
              <NoticiaCard noticia={destaque} grande />
              <div className="grid gap-6 sm:grid-cols-2">
                {demais.slice(0, 2).map(n => (
                  <NoticiaCard key={n.id} noticia={n} />
                ))}
              </div>
            </div>
            {demais.length > 2 && (
              <h2 className="mt-10 mb-4 flex items-center gap-3 text-xl font-black text-slate-900">
                <span className="h-1 w-8 rounded bg-amber-500" /> Mais notícias
              </h2>
            )}
            <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {demais.slice(2).map(n => (
                <NoticiaCard key={n.id} noticia={n} />
              ))}
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-zinc-300 bg-white py-20 text-center">
            <Newspaper className="h-12 w-12 text-zinc-300" />
            <h2 className="mt-4 text-lg font-bold text-slate-900">Nenhuma notícia publicada ainda</h2>
            <p className="mt-1 text-sm text-zinc-500">Aguarde as primeiras publicações do JUINA360º.</p>
          </div>
        )}
      </div>
    </div>
  );
}
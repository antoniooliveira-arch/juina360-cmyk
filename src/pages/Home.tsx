import { Link } from 'react-router-dom';
import { useApp } from '@/context/AppContext';
import { NoticiaCard } from '@/components/noticias/NoticiaCard';
import { PatrocinadoresDestaque } from '@/components/patrocinadores/PatrocinadoresDestaque';
import { Reveal } from '@/components/Reveal';
import { Newspaper, Flame } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export function Home() {
  const { noticias, patrocinadores } = useApp();
  const publicadas = noticias.filter(n => n.status === 'publicado');
  const destaque = publicadas.find(n => n.destaque) ?? publicadas[0];
  const demais = publicadas.filter(n => n.id !== destaque?.id);
  const ticker = [...publicadas].sort((a, b) => {
    const da = a.dataPublicacao ?? a.dataCriacao;
    const db = b.dataPublicacao ?? b.dataCriacao;
    return new Date(db).getTime() - new Date(da).getTime();
  }).slice(0, 6);

  const dataHero = destaque ? (destaque.dataPublicacao ?? destaque.dataCriacao) : null;
  const legenda = (d: Date | string | undefined | null) => {
    if (!d) return '';
    const dt = d instanceof Date ? d : parseISO(String(d));
    return format(dt, "dd 'de' MMMM", { locale: ptBR });
  };

  return (
    <div>
      <div className="border-b border-zinc-200 bg-white">
        <div className="mx-auto flex h-10 max-w-7xl items-center gap-3 px-4 text-sm">
          <span className="flex shrink-0 items-center gap-1.5 rounded-md bg-red-600 px-2 py-1 text-[10px] font-black uppercase tracking-wider text-white">
            <Flame className="h-3 w-3" /> Últimas
          </span>
          {ticker.length > 0 && (
            <div className="relative flex-1 overflow-hidden">
              <div className="animate-marquee flex w-max items-center gap-10 whitespace-nowrap">
                {[...ticker, ...ticker].map((n, i) => (
                  <Link
                    key={`${n.id}-${i}`}
                    to={`/noticia/${n.slug}`}
                    className="text-xs font-medium text-zinc-600 transition hover:text-amber-600"
                  >
                    {n.titulo}
                  </Link>
                ))}
              </div>
            </div>
          )}
          {!ticker.length && (
            <span className="text-xs font-medium text-zinc-500">Notícias de Juína em tempo real</span>
          )}
        </div>
      </div>

      {patrocinadores.length > 0 && <PatrocinadoresDestaque />}

      <div className="mx-auto max-w-7xl px-4 py-6">
        {destaque ? (
          <>
            <Reveal>
              <Link to={`/noticia/${destaque.slug}`} className="group relative block overflow-hidden rounded-3xl">
              <div className="aspect-[16/8] w-full overflow-hidden md:aspect-[21/9]">
                {destaque.imagemUrl ? (
                  <img
                    src={destaque.imagemUrl}
                    alt={destaque.titulo}
                    className="h-full w-full object-cover transition duration-[1200ms] ease-out group-hover:scale-105"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-slate-800 via-slate-900 to-black">
                    <span className="brand-gradient animate-float bg-clip-text text-7xl font-black text-transparent">360º</span>
                  </div>
                )}
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/30 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-6 md:p-9">
                <div className="flex flex-wrap items-center gap-2">
                  {destaque.categoriaNome && (
                    <span className="rounded-full bg-amber-500 px-3 py-1 text-[11px] font-black uppercase tracking-wider text-slate-900">
                      {destaque.categoriaNome}
                    </span>
                  )}
                  {destaque.destaque && (
                    <span className="rounded-full bg-white/15 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-white backdrop-blur">
                      Em destaque
                    </span>
                  )}
                  <span className="text-xs font-medium text-zinc-300">{legenda(dataHero)}</span>
                </div>
                <h1 className="mt-3 max-w-3xl font-serif text-2xl font-black leading-tight text-white transition group-hover:text-amber-300 md:text-4xl">
                  {destaque.titulo}
                </h1>
                <p className="mt-2 hidden max-w-2xl text-sm text-zinc-300 md:block">{destaque.resumo}</p>
                <span className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-amber-400">
                  Leia a matéria completa <span className="transition group-hover:translate-x-1">→</span>
                </span>
              </div>
            </Link>
            </Reveal>

            <div className="mt-6 grid gap-6 lg:grid-cols-3">
              {demais.slice(0, 3).map((n, i) => (
                <Reveal key={n.id} delay={i * 90}>
                  <NoticiaCard noticia={n} />
                </Reveal>
              ))}
            </div>

            {demais.length > 3 && (
              <div className="mt-12 mb-5">
                <h2 className="title-accent font-display flex items-center gap-3 text-2xl font-extrabold text-slate-900">
                  Mais notícias <span className="brand-gradient h-1.5 flex-1 rounded-full opacity-60" />
                </h2>
              </div>
            )}
            <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {demais.slice(3).map((n, i) => (
                <Reveal key={n.id} delay={(i % 3) * 90}>
                  <NoticiaCard noticia={n} />
                </Reveal>
              ))}
            </div>
          </>
        ) : (
          <Reveal>
            <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-zinc-300 bg-white py-20 text-center">
              <span className="brand-gradient flex h-16 w-16 items-center justify-center rounded-2xl">
                <Newspaper className="h-8 w-8 text-white" />
              </span>
              <h2 className="mt-5 text-xl font-black text-slate-900">Nenhuma notícia publicada ainda</h2>
              <p className="mt-1 text-sm text-zinc-500">Aguarde as primeiras publicações do JUINA360º.</p>
            </div>
          </Reveal>
        )}
      </div>
    </div>
  );
}
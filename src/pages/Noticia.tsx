import { useParams, Link } from 'react-router-dom';
import { useApp } from '@/context/AppContext';
import { FileQuestion, Home as HomeIcon, ChevronRight, CalendarDays, Eye, Share2 } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export function Noticia() {
  const { slug } = useParams<{ slug: string }>();
  const { noticias } = useApp();
  const noticia = noticias.find(n => n.slug === slug && n.status === 'publicado');

  if (!noticia) {
    return (
      <div className="mx-auto flex max-w-3xl flex-col items-center justify-center px-4 py-24 text-center">
        <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-zinc-100">
          <FileQuestion className="h-8 w-8 text-zinc-400" />
        </span>
        <h1 className="mt-5 text-xl font-black text-slate-900">Notícia não encontrada</h1>
        <Link to="/" className="mt-3 text-sm font-bold text-amber-600 hover:underline">Voltar para a home</Link>
      </div>
    );
  }

  const data = noticia.dataPublicacao ?? noticia.dataCriacao;
  const dataStr = data instanceof Date ? data : new Date(data);

  const compartilhar = async () => {
    const url = window.location.href;
    try {
      if (navigator.share) {
        await navigator.share({ title: noticia.titulo, url });
      } else {
        await navigator.clipboard.writeText(url);
        alert('Link copiado para a área de transferência.');
      }
    } catch {
      /* cancelado */
    }
  };

  return (
    <article className="mx-auto max-w-3xl px-4 py-8">
      <nav className="flex items-center gap-1 text-sm text-zinc-500">
        <Link to="/" className="flex items-center gap-1 hover:text-amber-600">
          <HomeIcon className="h-3.5 w-3.5" /> Home
        </Link>
        {noticia.categoriaNome && (
          <>
            <ChevronRight className="h-3.5 w-3.5" />
            <Link to={`/categoria/${noticia.categoriaId}`} className="hover:text-amber-600">{noticia.categoriaNome}</Link>
          </>
        )}
      </nav>

      {noticia.categoriaNome && (
        <span className="mt-5 inline-block rounded-full bg-amber-100 px-3 py-1 text-xs font-black uppercase tracking-wider text-amber-700">
          {noticia.categoriaNome}
        </span>
      )}
      <h1 className="mt-2 font-serif text-3xl font-black leading-tight text-slate-900 md:text-4xl">{noticia.titulo}</h1>
      <p className="mt-3 text-lg leading-relaxed text-zinc-600">{noticia.resumo}</p>

      <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-y border-zinc-200 py-4 text-sm text-zinc-500">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
          <span className="flex items-center gap-1.5 font-semibold text-slate-900">
            <span className="brand-gradient flex h-8 w-8 items-center justify-center rounded-full text-xs font-black text-white">
              {noticia.autorNome.slice(0, 1).toUpperCase()}
            </span>
            {noticia.autorNome}
          </span>
          <span className="flex items-center gap-1.5">
            <CalendarDays className="h-4 w-4" />
            {format(dataStr, "dd 'de' MMMM 'de' yyyy 'às' HH:mm", { locale: ptBR })}
          </span>
          <span className="flex items-center gap-1.5">
            <Eye className="h-4 w-4" /> {noticia.views} visualizações
          </span>
        </div>
        <button
          onClick={compartilhar}
          className="flex items-center gap-2 rounded-lg bg-slate-900 px-3.5 py-2 text-xs font-bold text-white transition hover:bg-slate-700"
        >
          <Share2 className="h-3.5 w-3.5" /> Compartilhar
        </button>
      </div>

      <div className="mt-6 overflow-hidden rounded-3xl shadow-xl shadow-slate-900/10">
        {noticia.imagemUrl ? (
          <img src={noticia.imagemUrl} alt={noticia.titulo} className="h-auto w-full" />
        ) : (
          <div className="flex h-56 items-center justify-center bg-gradient-to-br from-slate-800 via-slate-900 to-black">
            <span className="brand-gradient bg-clip-text text-6xl font-black text-transparent">360º</span>
          </div>
        )}
      </div>

      <div className="prose-news mt-7 text-slate-800">
        {noticia.conteudo.split('\n').map((paragrafo, i) =>
          paragrafo.trim() ? <p key={i}>{paragrafo}</p> : null
        )}
      </div>

      {noticia.autorNome === 'JUINA360º' && (
        <div className="mt-8 flex items-start gap-3 rounded-2xl border border-zinc-200 bg-white p-5">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-900 text-sm font-black text-amber-400">360</span>
          <div>
            <div className="font-bold text-slate-900">{noticia.autorNome}</div>
            <p className="mt-1 text-sm text-zinc-600">Siga o JUINA360º para acompanhar as notícias de Juína em todas as direções.</p>
          </div>
        </div>
      )}
    </article>
  );
}
import { useParams, Link } from 'react-router-dom';
import { useApp } from '@/context/AppContext';
import { FileQuestion } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export function Noticia() {
  const { slug } = useParams<{ slug: string }>();
  const { noticias } = useApp();
  const noticia = noticias.find(n => n.slug === slug && n.status === 'publicado');

  if (!noticia) {
    return (
      <div className="mx-auto flex max-w-3xl flex-col items-center justify-center px-4 py-24 text-center">
        <FileQuestion className="h-12 w-12 text-zinc-300" />
        <h1 className="mt-4 text-xl font-bold text-slate-900">Notícia não encontrada</h1>
        <Link to="/" className="mt-3 text-sm font-semibold text-amber-600 hover:underline">Voltar para a home</Link>
      </div>
    );
  }

  const data = noticia.dataPublicacao ?? noticia.dataCriacao;
  const dataStr = data instanceof Date ? data : new Date(data);

  return (
    <article className="mx-auto max-w-3xl px-4 py-6">
      <nav className="text-sm text-zinc-500">
        <Link to="/" className="hover:text-amber-600">Home</Link>
        {noticia.categoriaNome && (
          <>
            <span className="mx-2">/</span>
            <Link to={`/categoria/${noticia.categoriaId}`} className="hover:text-amber-600">{noticia.categoriaNome}</Link>
          </>
        )}
      </nav>

      {noticia.categoriaNome && (
        <span className="mt-4 inline-block text-xs font-bold uppercase tracking-wider text-amber-600">{noticia.categoriaNome}</span>
      )}
      <h1 className="mt-1 text-3xl font-black leading-tight text-slate-900 md:text-4xl">{noticia.titulo}</h1>
      <p className="mt-3 text-lg text-zinc-600">{noticia.resumo}</p>

      <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-zinc-500">
        <span className="font-semibold text-slate-900">{noticia.autorNome}</span>
        <span>•</span>
        <span>{format(dataStr, "dd 'de' MMMM 'de' yyyy 'às' HH:mm", { locale: ptBR })}</span>
        <span>•</span>
        <span>{noticia.views} visualizações</span>
      </div>

      <div className="mt-6 overflow-hidden rounded-xl bg-gradient-to-br from-slate-800 to-slate-900">
        {noticia.imagemUrl ? (
          <img src={noticia.imagemUrl} alt={noticia.titulo} className="h-auto w-full" />
        ) : (
          <div className="flex h-56 items-center justify-center">
            <span className="text-5xl font-black text-amber-400">360º</span>
          </div>
        )}
      </div>

      <div className="prose-news mt-6 text-slate-800">
        {noticia.conteudo.split('\n').map((paragrafo, i) =>
          paragrafo.trim() ? <p key={i}>{paragrafo}</p> : null
        )}
      </div>
    </article>
  );
}
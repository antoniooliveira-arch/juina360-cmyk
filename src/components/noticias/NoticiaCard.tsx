import { Link } from 'react-router-dom';
import type { Noticia } from '@/types';
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export function NoticiaCard({ noticia, grande = false }: { noticia: Noticia; grande?: boolean }) {
  const data = noticia.dataPublicacao ?? noticia.dataCriacao;
  const dataStr = data instanceof Date ? data : parseISO(String(data));

  return (
    <Link
      to={`/noticia/${noticia.slug}`}
      className="group flex flex-col overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm transition hover:shadow-md"
    >
      <div className={grande ? 'aspect-[16/9] w-full' : 'aspect-[16/9] w-full'}>
        {noticia.imagemUrl ? (
          <img src={noticia.imagemUrl} alt={noticia.titulo} className="h-full w-full object-cover transition group-hover:scale-105" />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-slate-800 to-slate-900">
            <span className="text-4xl font-black text-amber-400">360º</span>
          </div>
        )}
      </div>
      <div className="flex flex-1 flex-col p-4">
        {noticia.categoriaNome && (
          <span className="text-xs font-bold uppercase tracking-wider text-amber-600">{noticia.categoriaNome}</span>
        )}
        <h3 className={`mt-1 font-serif font-bold text-slate-900 group-hover:text-amber-600 ${grande ? 'text-xl' : 'text-base'}`}>
          {noticia.titulo}
        </h3>
        <p className="mt-2 line-clamp-2 flex-1 text-sm text-zinc-600">{noticia.resumo}</p>
        <div className="mt-3 flex items-center justify-between text-xs text-zinc-500">
          <span>{noticia.autorNome}</span>
          <span>{format(dataStr, "dd 'de' MMM", { locale: ptBR })}</span>
        </div>
      </div>
    </Link>
  );
}
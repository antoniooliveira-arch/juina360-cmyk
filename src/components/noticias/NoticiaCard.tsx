import { Link } from 'react-router-dom';
import type { Noticia } from '@/types';
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { CalendarDays, PenLine } from 'lucide-react';

export function NoticiaCard({ noticia, grande = false }: { noticia: Noticia; grande?: boolean }) {
  const data = noticia.dataPublicacao ?? noticia.dataCriacao;
  const dataStr = data instanceof Date ? data : parseISO(String(data));

  return (
    <Link
      to={`/noticia/${noticia.slug}`}
      className="card-hover group flex flex-col overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm"
    >
      <div className={`${grande ? 'aspect-[16/9]' : 'aspect-[16/9]'} relative w-full overflow-hidden`}>
        {noticia.imagemUrl ? (
          <img
            src={noticia.imagemUrl}
            alt={noticia.titulo}
            className="h-full w-full object-cover transition duration-700 ease-out group-hover:scale-110"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-slate-800 via-slate-900 to-black">
            <span className="brand-gradient bg-clip-text text-4xl font-black text-transparent">360º</span>
          </div>
        )}
        {noticia.categoriaNome && (
          <span className="absolute left-3 top-3 rounded-full bg-black/55 px-2.5 py-1 text-[10px] font-black uppercase tracking-wider text-amber-400 backdrop-blur transition group-hover:bg-amber-500 group-hover:text-slate-900">
            {noticia.categoriaNome}
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col p-4">
        <h3 className={`font-serif font-bold leading-snug text-slate-900 transition group-hover:text-amber-600 ${grande ? 'text-xl' : 'text-[1.02rem]'}`}>
          {noticia.titulo}
        </h3>
        <p className="mt-2 line-clamp-2 flex-1 text-sm leading-relaxed text-zinc-600">{noticia.resumo}</p>
        <div className="mt-4 flex items-center justify-between border-t border-zinc-100 pt-3 text-xs text-zinc-500">
          <span className="flex items-center gap-1.5 font-medium">
            <PenLine className="h-3.5 w-3.5 text-amber-500" /> {noticia.autorNome}
          </span>
          <span className="flex items-center gap-1.5">
            <CalendarDays className="h-3.5 w-3.5" /> {format(dataStr, "dd 'de' MMM", { locale: ptBR })}
          </span>
        </div>
      </div>
    </Link>
  );
}
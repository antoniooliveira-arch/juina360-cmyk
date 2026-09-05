import { Megaphone, ExternalLink } from 'lucide-react';
import type { Campanha } from '@/types';
import { registrarCliqueCampanha } from '@/lib/supabaseService';
import { fotoDe } from '@/lib/adUtils';
import { useRotacao, atualDaRotacao } from '@/hooks/useRotacao';

export function AdLateral({ campanhas, lado }: { campanhas: Campanha[]; lado: 'esquerda' | 'direita' }) {
  const indice = useRotacao(campanhas.length, 9000);
  const atual = atualDaRotacao(campanhas, indice);
  if (!atual) return null;

  const mkdei = fotoDe(atual);

  const aoClicar = () => registrarCliqueCampanha(atual.id).catch(() => {});
  const destino = atual.linkUrl;

  return (
    <aside className={`sticky top-24 hidden xl:block ${lado === 'esquerda' ? '' : ''}`}>
      <a
        href={destino ?? undefined}
        onClick={e => {
          if (!destino) e.preventDefault();
          aoClicar();
        }}
        target={destino ? '_blank' : undefined}
        rel={destino ? 'noopener noreferrer' : undefined}
        className="group block w-56 overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm transition hover:shadow-md"
      >
        {mkdei ? (
          mkdei.tipo === 'video' ? (
            <video src={mkdei.url} muted loop playsInline className="h-40 w-full object-cover" />
          ) : (
            <img src={mkdei.url} alt={atual.titulo} className="h-40 w-full object-cover" />
          )
        ) : (
          <div className="flex h-40 w-full items-center justify-center bg-gradient-to-br from-slate-800 to-amber-950">
            <span className="text-4xl font-black text-amber-400">360º</span>
          </div>
        )}
        <div className="p-3">
          <span className="flex items-center gap-1 text-[9px] font-bold uppercase tracking-widest text-amber-600">
            <Megaphone className="h-3 w-3" /> Anúncio
          </span>
          <p className="mt-1 line-clamp-2 text-sm font-extrabold leading-snug text-slate-900">{atual.titulo}</p>
          {destino && (
            <span className="mt-2 inline-flex items-center gap-1 text-[11px] font-bold text-amber-600 transition group-hover:gap-1.5">
              Saiba mais <ExternalLink className="h-3 w-3" />
            </span>
          )}
        </div>
      </a>
    </aside>
  );
}
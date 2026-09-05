import { Megaphone, ExternalLink } from 'lucide-react';
import type { Campanha } from '@/types';
import { registrarCliqueCampanha } from '@/lib/supabaseService';
import { fotoDe } from '@/lib/adUtils';
import { useRotacao, atualDaRotacao } from '@/hooks/useRotacao';

export function AdConteudo({ campanhas }: { campanhas: Campanha[] }) {
  const indice = useRotacao(campanhas.length, 12000);
  const atual = atualDaRotacao(campanhas, indice);
  if (!atual) return null;

  const mkdei = fotoDe(atual);

  const aoClicar = () => registrarCliqueCampanha(atual.id).catch(() => {});
  const destino = atual.linkUrl;

  return (
    <a
      href={destino ?? undefined}
      onClick={e => {
        if (!destino) e.preventDefault();
        aoClicar();
      }}
      target={destino ? '_blank' : undefined}
      rel={destino ? 'noopener noreferrer' : undefined}
      className="my-6 flex items-center gap-4 overflow-hidden rounded-2xl border border-dashed border-zinc-300 bg-gradient-to-r from-amber-50 via-white to-zinc-50 px-4 py-3 transition hover:border-amber-400 hover:shadow-sm"
    >
      {mkdei && (
        <span className="relative h-14 w-20 shrink-0 overflow-hidden rounded-xl">
          {mkdei.tipo === 'video' ? (
            <video src={mkdei.url} muted loop playsInline className="h-full w-full object-cover" />
          ) : (
            <img src={mkdei.url} alt={atual.titulo} className="h-full w-full object-cover" />
          )}
        </span>
      )}
      <div className="min-w-0 flex-1">
        <span className="flex items-center gap-1 text-[9px] font-bold uppercase tracking-widest text-amber-600">
          <Megaphone className="h-3 w-3" /> Patrocínio
        </span>
        <p className="truncate text-sm font-extrabold text-slate-900">{atual.titulo}</p>
        {atual.sponsorNome && <p className="truncate text-[11px] text-zinc-500">Por {atual.sponsorNome}</p>}
      </div>
      {destino && (
        <span className="flex shrink-0 items-center gap-1 rounded-xl bg-amber-500 px-3 py-1.5 text-[11px] font-extrabold uppercase text-slate-900">
          Ver <ExternalLink className="h-3 w-3" />
        </span>
      )}
    </a>
  );
}
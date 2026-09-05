import { Megaphone, ExternalLink } from 'lucide-react';
import type { Campanha } from '@/types';
import { registrarCliqueCampanha } from '@/lib/supabaseService';
import { fotoDe } from '@/lib/adUtils';
import { useRotacao, atualDaRotacao } from '@/hooks/useRotacao';

export function AdSlotTopo({ campanhas }: { campanhas: Campanha[] }) {
  const indice = useRotacao(campanhas.length, 8000);
  const atual = atualDaRotacao(campanhas, indice);
  if (!atual) return null;

  const mkdei = fotoDe(atual);

  const aoClicar = () => registrarCliqueCampanha(atual.id).catch(() => {});
  const destino = atual.linkUrl;

  return (
    <div className="mx-auto w-full max-w-7xl px-4 pt-3">
      <a
        href={destino ?? undefined}
        onClick={e => {
          if (!destino) e.preventDefault();
          aoClicar();
        }}
        target={destino ? '_blank' : undefined}
        rel={destino ? 'noopener noreferrer' : undefined}
        className="flex items-center justify-between gap-4 overflow-hidden rounded-2xl border border-zinc-200 bg-gradient-to-r from-slate-900 via-slate-800 to-amber-900 px-5 py-3 shadow-sm transition hover:border-amber-300"
      >
        <span className="flex shrink-0 items-center gap-1.5 text-[9px] font-bold uppercase tracking-widest text-amber-400/90">
          <Megaphone className="h-3 w-3" /> Patrocínio
        </span>
        <div className="flex min-w-0 flex-1 items-center justify-center gap-3">
          {mkdei?.tipo === 'imagem' ? (
            <img src={mkdei.url} alt={atual.titulo} className="h-8 w-8 rounded-lg object-cover" />
          ) : (
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-amber-500 text-sm font-black text-slate-900">
              {(atual.titulo || '?').charAt(0)}
            </span>
          )}
          <div className="min-w-0">
            <p className="truncate text-sm font-extrabold text-white">{atual.titulo}</p>
            {atual.sponsorNome && <p className="truncate text-[11px] text-zinc-300">Por {atual.sponsorNome}</p>}
          </div>
        </div>
        {destino && (
          <span className="flex shrink-0 items-center gap-1 rounded-xl bg-amber-500 px-3 py-1.5 text-[11px] font-extrabold uppercase tracking-wide text-slate-900">
            Saiba mais <ExternalLink className="h-3 w-3" />
          </span>
        )}
      </a>
    </div>
  );
}
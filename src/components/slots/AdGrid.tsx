import { Handshake, ExternalLink } from 'lucide-react';
import type { Campanha } from '@/types';
import { registrarCliqueCampanha } from '@/lib/supabaseService';
import { fotoDe } from '@/lib/adUtils';
import { useRotacao } from '@/hooks/useRotacao';

export function AdGrid({ campanhas, max = 4 }: { campanhas: Campanha[]; max?: number }) {
  const total = campanhas.length;
  const indice = useRotacao(Math.max(total, 1), 10000);
  if (!total) return null;

  const visiveis = Array.from(
    { length: Math.min(max, total) },
    (_, i) => campanhas[((indice + i) % total + total) % total],
  );

  const aoClicar = (c: Campanha) => registrarCliqueCampanha(c.id).catch(() => {});

  return (
    <section className="mx-auto w-full max-w-7xl px-4 pt-8">
      <h2 className="flex items-center gap-2 font-display text-xl font-extrabold uppercase tracking-wide text-slate-900">
        <Handshake className="h-5 w-5 text-amber-500" />
        Patrocinadores
      </h2>
      <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-4">
        {visiveis.map(c => {
          const mkdei = fotoDe(c);
          return (
            <a
              key={c.id}
              href={c.linkUrl ?? undefined}
              onClick={e => {
                if (!c.linkUrl) e.preventDefault();
                aoClicar(c);
              }}
              target={c.linkUrl ? '_blank' : undefined}
              rel={c.linkUrl ? 'noopener noreferrer' : undefined}
              className="group flex items-center gap-3 rounded-2xl border border-zinc-200 bg-white p-3 shadow-sm transition hover:-translate-y-0.5 hover:border-amber-300 hover:shadow-md"
            >
              {mkdei ? (
                <span className="h-10 w-10 shrink-0 overflow-hidden rounded-xl">
                  <img src={mkdei.url} alt={c.titulo} className="h-full w-full object-cover" />
                </span>
              ) : (
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-100 text-base font-black text-amber-700">
                  {(c.titulo || '?').charAt(0)}
                </span>
              )}
              <span className="min-w-0">
                <span className="block truncate text-sm font-extrabold text-slate-900">{c.titulo}</span>
                <span className="flex items-center gap-1 text-[10px] font-semibold text-zinc-500 transition group-hover:text-amber-600">
                  Conhecer <ExternalLink className="h-2.5 w-2.5" />
                </span>
              </span>
            </a>
          );
        })}
      </div>
    </section>
  );
}
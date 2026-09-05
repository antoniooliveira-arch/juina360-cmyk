import { HeartHandshake } from 'lucide-react';
import type { Campanha } from '@/types';
import { registrarCliqueCampanha } from '@/lib/supabaseService';
import { fotoDe } from '@/lib/adUtils';

export function AdRodape({ campanhas, max = 4 }: { campanhas: Campanha[]; max?: number }) {
  if (!campanhas.length) return null;
  const visiveis = campanhas.slice(0, max);

  const aoClicar = (c: Campanha) => registrarCliqueCampanha(c.id).catch(() => {});

  return (
    <div className="border-t border-zinc-800 bg-slate-950">
      <div className="mx-auto flex w-full max-w-7xl flex-wrap items-center justify-center gap-x-8 gap-y-3 px-6 py-5">
        <span className="flex items-center gap-1.5 text-[10px] font-extrabold uppercase tracking-widest text-zinc-500">
          <HeartHandshake className="h-3.5 w-3.5 text-amber-500" /> Apoiado por
        </span>
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
              className="group flex items-center gap-2 text-zinc-300 transition hover:text-amber-400"
            >
              {mkdei?.tipo === 'imagem' ? (
                <img src={mkdei.url} alt={c.titulo} className="h-6 w-6 rounded object-cover" />
              ) : (
                <span className="flex h-6 w-6 items-center justify-center rounded bg-amber-500/15 text-[10px] font-black text-amber-500">
                  {(c.titulo || '?').charAt(0)}
                </span>
              )}
              <span className="text-xs font-bold">{c.titulo}</span>
            </a>
          );
        })}
      </div>
    </div>
  );
}
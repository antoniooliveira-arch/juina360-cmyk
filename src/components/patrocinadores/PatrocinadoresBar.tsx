import { useApp } from '@/context/AppContext';

export function PatrocinadoresBar() {
  const { patrocinadores } = useApp();
  const ativos = patrocinadores.filter(p => p.ativo);

  if (!ativos.length) return null;

  return (
    <div className="rounded-xl border border-zinc-200 bg-white px-4 py-3">
      <div className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Apoiadores</div>
      <div className="mt-2 flex flex-wrap items-center gap-x-6 gap-y-3">
        {ativos.map(p => {
          const logo = p.media?.find(m => m.tipo === 'imagem');
          if (logo) {
            return (
              <img
                key={p.id}
                src={logo.url}
                alt={p.nome}
                title={p.nome}
                className="h-10 max-w-[160px] object-contain opacity-80 transition hover:opacity-100"
              />
            );
          }
          return (
            <span key={p.id} className="text-sm font-semibold text-slate-700">
              {p.nome}
            </span>
          );
        })}
      </div>
      <p className="mt-2 text-[11px] text-zinc-400">Conheça quem apoia o JUINA360º.</p>
    </div>
  );
}
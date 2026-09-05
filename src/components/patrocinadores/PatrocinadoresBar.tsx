import { useApp } from '@/context/AppContext';

export function PatrocinadoresBar() {
  const { patrocinadores } = useApp();
  const ativos = patrocinadores.filter(p => p.ativo);

  if (!ativos.length) return null;

  return (
    <div className="rounded-xl border border-zinc-200 bg-white px-4 py-3">
      <div className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Apoiadores</div>
      <div className="mt-2 flex flex-wrap items-center gap-x-6 gap-y-2">
        {ativos.map(p => (
          <span key={p.id} className="text-sm font-semibold text-slate-700">
            {p.nome}
          </span>
        ))}
      </div>
    </div>
  );
}
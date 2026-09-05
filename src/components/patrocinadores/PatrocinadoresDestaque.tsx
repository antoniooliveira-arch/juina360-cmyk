import { useState, useEffect, useCallback } from 'react';
import { useApp } from '@/context/AppContext';
import { Award, ChevronLeft, ChevronRight } from 'lucide-react';

export function PatrocinadoresDestaque() {
  const { patrocinadores } = useApp();
  const ativos = patrocinadores.filter(p => p.ativo);
  const [indice, setIndice] = useState(0);
  const [pausado, setPausado] = useState(false);

  const proximo = useCallback(() => {
    setIndice(i => (i + 1) % Math.max(ativos.length, 1));
  }, [ativos.length]);

  useEffect(() => {
    if (ativos.length <= 1 || pausado) return;
    const timer = setInterval(proximo, 4500);
    return () => clearInterval(timer);
  }, [proximo, ativos.length, pausado]);

  if (!ativos.length) return null;

  const apenasUm = ativos.length === 1;
  const foto = (p: { media?: { tipo: string; url: string }[] }) =>
    p.media?.find(m => m.tipo === 'imagem') ?? p.media?.find(m => m.tipo === 'video');

  if (apenasUm && !foto(ativos[0])) {
    const p = ativos[0];
    return (
      <section className="mx-auto max-w-6xl px-4 pt-4">
        <div className="flex w-full items-center justify-between gap-4 rounded-2xl border border-amber-200 bg-gradient-to-r from-amber-50 to-white p-5 shadow-sm">
          <div>
            <div className="text-[10px] font-bold uppercase tracking-widest text-amber-700">Patrocinador oficial</div>
            <div className="mt-1 text-xl font-black text-slate-900">{p.nome}</div>
          </div>
          {p.url && (
            <a
              href={p.url}
              target="_blank"
              rel="noreferrer"
              className="rounded-lg bg-amber-500 px-4 py-2 text-sm font-bold text-slate-900 transition hover:bg-amber-400"
            >
              Visite →
            </a>
          )}
        </div>
      </section>
    );
  }

  return (
    <section className="mx-auto w-full max-w-6xl px-4 pt-4">
      <h2 className="flex items-center gap-2 font-display text-xl font-extrabold uppercase tracking-wide text-slate-900">
        <Award className="h-5 w-5 text-amber-500" />
        Patrocinadores
      </h2>

      <div
        className="group relative mt-3 overflow-hidden rounded-3xl border border-zinc-200 bg-white shadow-md"
        onMouseEnter={() => setPausado(true)}
        onMouseLeave={() => setPausado(false)}
      >
        <div
          className="flex transition-transform duration-700 ease-in-out"
          style={{ transform: `translateX(-${indice * 100}%)` }}
        >
          {ativos.map(p => {
            const m = foto(p);
            return (
              <div key={p.id} className="relative h-56 w-full shrink-0 overflow-hidden md:h-72">
                {m ? (
                  m.tipo === 'video' ? (
                    <video src={m.url} muted loop playsInline className="h-full w-full object-cover" />
                  ) : (
                    <img src={m.url} alt={p.nome} className="h-full w-full object-cover" />
                  )
                ) : (
                  <div className="flex h-full w-full flex-col items-center justify-center bg-gradient-to-br from-slate-800 via-slate-900 to-amber-950">
                    <span className="text-6xl font-black text-amber-400">360º</span>
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-5">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-amber-400">
                    Conheça quem apoia
                  </span>
                  <h3 className="mt-1 text-2xl font-black text-white md:text-3xl">{p.nome}</h3>
                  {p.url && (
                    <a
                      href={p.url}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-2 inline-block rounded-lg bg-white/90 px-3 py-1.5 text-sm font-semibold text-slate-900 transition hover:bg-white"
                    >
                      Visite o site →
                    </a>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {ativos.length > 1 && (
          <>
            <button
              onClick={() => setIndice(i => (i - 1 + ativos.length) % ativos.length)}
              className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-black/40 p-2 text-white opacity-0 transition group-hover:opacity-100 hover:bg-black/60"
              aria-label="Anterior"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              onClick={proximo}
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-black/40 p-2 text-white opacity-0 transition group-hover:opacity-100 hover:bg-black/60"
              aria-label="Próximo"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
            <div className="absolute bottom-3 right-3 flex gap-1.5">
              {ativos.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setIndice(i)}
                  className={`h-2 rounded-full transition-all ${i === indice ? 'w-6 bg-amber-400' : 'w-2 bg-white/60 hover:bg-white'}`}
                  aria-label={`Slide ${i + 1}`}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
}
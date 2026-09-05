import { useState, useEffect, useCallback, useRef } from 'react';
import { useApp } from '@/context/AppContext';
import {
  Award, ChevronLeft, ChevronRight, Play, Megaphone, ExternalLink,
} from 'lucide-react';

export function PatrocinadoresDestaque() {
  const { patrocinadores } = useApp();
  const ativos = patrocinadores.filter(p => p.ativo);
  const [indice, setIndice] = useState(0);
  const [pausado, setPausado] = useState(false);
  const [tocando, setTocando] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const total = ativos.length;

  const fotoDe = (p: { media?: { tipo: string; url: string; nome: string }[] }) =>
    p.media?.find(m => m.tipo === 'imagem') ?? p.media?.find(m => m.tipo === 'video');

  const musicaDe = (p: { media?: { tipo: string; url: string; nome: string }[] }) =>
    p.media?.find(m => m.tipo === 'audio');

  const proximo = useCallback(() => {
    setIndice(i => (i + 1) % Math.max(total, 1));
  }, [total]);

  const anterior = useCallback(() => {
    setIndice(i => (i - 1 + Math.max(total, 1)) % Math.max(total, 1));
  }, [total]);

  useEffect(() => {
    setTocando(false);
    audioRef.current?.pause();
  }, [indice]);

  useEffect(() => {
    if (total <= 1 || pausado) return;
    const timer = setInterval(proximo, 6000);
    return () => clearInterval(timer);
  }, [proximo, total, pausado]);

  if (!total) return null;

  const atual = ativos[((indice % total) + total) % total];
  const musica = musicaDe(atual);
  const musicaLabel = musica ? musica.nome.replace(/\.(mp3|wav|ogg|m4a)$/i, '') : null;

  const toggleMusica = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (tocando) {
      audio.pause();
      setTocando(false);
    } else {
      audio.currentTime = 0;
      audio.play().catch(() => setTocando(false));
      setTocando(true);
    }
  };

  return (
    <section className="mx-auto w-full max-w-7xl px-4 pt-4">
      <div className="flex items-center justify-between">
        <h2 className="flex items-center gap-2 font-display text-xl font-extrabold uppercase tracking-wide text-slate-900">
          <Award className="h-5 w-5 text-amber-500" />
          Patrocinadores
        </h2>
        <span className="flex items-center gap-1.5 rounded-full bg-zinc-200/70 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-zinc-500">
          <Megaphone className="h-3 w-3" /> Divulgação
        </span>
      </div>

      <div
        className="group relative mt-3 overflow-hidden rounded-3xl border border-zinc-200 shadow-lg shadow-slate-900/5"
        onMouseEnter={() => setPausado(true)}
        onMouseLeave={() => setPausado(false)}
      >
        <div
          className="flex transition-transform duration-700 ease-in-out"
          style={{ transform: `translateX(-${indice * 100}%)` }}
        >
          {ativos.map(p => {
            const m = fotoDe(p);
            return (
              <div key={p.id} className="relative h-60 w-full shrink-0 overflow-hidden md:h-[26rem]">
                {m ? (
                  m.tipo === 'video' ? (
                    <video src={m.url} muted loop playsInline className="h-full w-full object-cover" />
                  ) : (
                    <img src={m.url} alt={p.nome} className="h-full w-full object-cover" />
                  )
                ) : (
                  <div className="flex h-full w-full flex-col items-center justify-center bg-gradient-to-br from-slate-800 via-slate-900 to-amber-950">
                    <span className="text-6xl font-black text-amber-400 md:text-8xl">360º</span>
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/25 to-transparent" />

                <div className="absolute inset-x-0 bottom-0 flex flex-wrap items-end justify-between gap-4 p-5 md:p-8">
                  <div>
                    <span className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-amber-400">
                      <Megaphone className="h-3.5 w-3.5" /> Conheça quem apoia
                    </span>
                    <h3 className="mt-1 font-display text-2xl font-extrabold text-white drop-shadow md:text-4xl">
                      {p.nome}
                    </h3>
                    {p.url && (
                      <a
                        href={p.url}
                        target="_blank"
                        rel="noreferrer"
                        className="mt-2 inline-flex items-center gap-1.5 rounded-xl bg-white px-4 py-2 text-sm font-bold text-slate-900 shadow-md transition hover:-translate-y-0.5 hover:bg-amber-100"
                      >
                        Visite o site <ExternalLink className="h-3.5 w-3.5" />
                      </a>
                    )}
                  </div>

                  {musicaDe(p) && (
                    <button
                      onClick={toggleMusica}
                      className={`flex items-center gap-2 rounded-2xl px-4 py-3 text-sm font-bold shadow-lg backdrop-blur transition ${
                        tocando && p.id === atual.id
                          ? 'bg-amber-500 text-slate-900'
                          : 'bg-black/45 text-white hover:bg-black/60'
                      }`}
                      aria-label={tocando ? 'Pausar música' : 'Tocar música'}
                    >
                      {tocando && p.id === atual.id ? (
                        <>
                          <span className="eq text-amber-900"><span /><span /><span /></span>
                          <span className="max-w-[150px] truncate">{musicaLabel}</span>
                        </>
                      ) : (
                        <>
                          <Play className="h-4 w-4 fill-current" />
                          <span className="max-w-[150px] truncate">Tocar música</span>
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {total > 1 && (
          <>
            <button
              onClick={anterior}
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
            <div className="absolute bottom-3 right-3 flex gap-1.5 md:hidden">
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

      {musica && (
        <audio
          key={`${atual.id}-${indice}`}
          ref={audioRef}
          src={musica.url}
          loop
          preload="auto"
          className="hidden"
        />
      )}
    </section>
  );
}
import { useState } from 'react';
import { useToast } from '@/components/ui/Toast';
import type { Sponsor, Campanha, StatusCampanha, TipoMedia } from '@/types';
import * as api from '@/lib/supabaseService';
import { supabaseDisponivel } from '@/lib/supabaseService';
import { Image as ImageIcon, Video, Music, X, CalendarClock, Link2, Megaphone, Music2 } from 'lucide-react';

interface MediaItem {
  id: string;
  tipo: TipoMedia;
  nome: string;
  url: string;
  data: Date;
}

export interface CampanhaPayload {
  sponsorId?: string;
  titulo: string;
  descricao?: string;
  linkUrl?: string;
  media?: MediaItem[];
  startAt?: Date;
  endAt?: Date;
  status: StatusCampanha;
}

const LIMITES: Record<TipoMedia, { max: number; msg: string; dica: string }> = {
  imagem: { max: 10, msg: 'A foto deve ter no máximo 10 MB.', dica: 'JPG, PNG ou WEBP (até 10 MB)' },
  video: { max: 100, msg: 'O vídeo deve ter no máximo 100 MB.', dica: 'MP4 ou WEBM (até 100 MB)' },
  audio: { max: 20, msg: 'A música deve ter no máximo 20 MB.', dica: 'MP3 ou WAV (até 20 MB)' },
};

const toDateTime = (d?: Date) =>
  d ? new Date(d).toLocaleString('sv-SE', { timeZone: 'America/Cuiaba' }).replace(' ', 'T') : '';

interface Props {
  initial?: Campanha | null;
  sponsors?: Sponsor[];
  sponsorFixado?: Sponsor;
  novoStatus?: StatusCampanha;
  submitLabel?: string;
  onSave: (payload: CampanhaPayload) => Promise<void>;
  onCancel: () => void;
}

export function CampanhaForm({
  initial,
  sponsors = [],
  sponsorFixado,
  novoStatus = 'rascunho',
  submitLabel = 'Salvar',
  onSave,
  onCancel,
}: Props) {
  const { toast } = useToast();
  const [titulo, setTitulo] = useState(initial?.titulo ?? '');
  const [descricao, setDescricao] = useState(initial?.descricao ?? '');
  const [sponsorId, setSponsorId] = useState(initial?.sponsorId ?? sponsorFixado?.id ?? '');
  const [linkUrl, setLinkUrl] = useState(initial?.linkUrl ?? '');
  const [startAt, setStartAt] = useState(toDateTime(initial?.startAt));
  const [endAt, setEndAt] = useState(toDateTime(initial?.endAt));
  const [media, setMedia] = useState<MediaItem[]>(
    (initial?.media ?? []).map(m => ({ id: m.id, tipo: m.tipo, nome: m.nome, url: m.url, data: m.data }))
  );
  const [declaraDireitos, setDeclaraDireitos] = useState(false);
  const [salvando, setSalvando] = useState(false);

  const precisaDeclaracao = media.some(m => m.tipo === 'audio');

  const lerArquivo = (tipo: TipoMedia) => async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    const limite = LIMITES[tipo];
    if (file.size > limite.max * 1024 * 1024) {
      toast('error', limite.msg);
      return;
    }
    const lerComoDataUrl = (): Promise<string> =>
      new Promise(resolve => {
        const reader = new FileReader();
        reader.onload = () => resolve(String(reader.result));
        reader.readAsDataURL(file);
      });
    try {
      let url = '';
      if (supabaseDisponivel) {
        toast('info', `Enviando "${file.name}" para o Storage...`);
        try {
          url = await api.uploadMedia(file, tipo);
        } catch (err) {
          console.warn('Upload falhou, usando local:', err);
          url = await lerComoDataUrl();
        }
      } else {
        url = await lerComoDataUrl();
      }
      setMedia(prev => {
        const semMesmoTipo = tipo === 'imagem' || tipo === 'video' ? prev.filter(m => m.tipo !== tipo) : prev;
        return [
          ...semMesmoTipo,
          { id: `med-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`, tipo, nome: file.name, url, data: new Date() },
        ];
      });
      toast('success', `"${file.name}" adicionado.`);
    } catch (err) {
      console.error(err);
      toast('error', 'Não foi possível ler o arquivo.');
    }
  };

  const removerMedia = (id: string) => {
    setMedia(prev => prev.filter(m => m.id !== id));
  };

  const salvar = async () => {
    if (!titulo.trim()) {
      toast('error', 'Informe o título da campanha.');
      return;
    }
    if (!sponsorFixado && !sponsorId) {
      toast('error', 'Selecione o patrocinador (empresa).');
      return;
    }
    if (precisaDeclaracao && !declaraDireitos) {
      toast('error', 'Marque a declaração de direitos do áudio antes de salvar.');
      return;
    }
    if (startAt && endAt && new Date(endAt) <= new Date(startAt)) {
      toast('error', 'A data de término deve ser posterior ao início.');
      return;
    }
    setSalvando(true);
    try {
      await onSave({
        sponsorId: sponsorFixado?.id ?? (sponsorId || undefined),
        titulo: titulo.trim(),
        descricao: descricao.trim() || undefined,
        linkUrl: linkUrl.trim() || undefined,
        media,
        startAt: startAt ? new Date(startAt) : undefined,
        endAt: endAt ? new Date(endAt) : undefined,
        status: novoStatus,
      });
    } finally {
      setSalvando(false);
    }
  };

  const input = 'mt-1.5 w-full rounded-xl border border-zinc-300 bg-zinc-50 px-3.5 py-2.5 text-sm outline-none transition focus:border-amber-500 focus:bg-white focus:ring-4 focus:ring-amber-500/15';

  return (
    <div className="grid gap-5 lg:grid-cols-2">
      <div className="space-y-4">
        <div>
          <label className="text-sm font-medium text-zinc-700">Título da campanha *</label>
          <input value={titulo} onChange={e => setTitulo(e.target.value)} placeholder="Ex.: Nova loja no shopping" className={input} />
        </div>

        <div>
          <label className="text-sm font-medium text-zinc-700">Descrição / texto do anúncio</label>
          <textarea
            value={descricao}
            onChange={e => setDescricao(e.target.value)}
            rows={3}
            placeholder="Resumo curto exibido no banner..."
            className={input}
          />
        </div>

        <div>
          <label className="text-sm font-medium text-zinc-700">Patrocinador (empresa)</label>
          {sponsorFixado ? (
            <div className="mt-1.5 flex items-center gap-2 rounded-xl border border-zinc-200 bg-zinc-100 px-3.5 py-2.5 text-sm font-semibold text-zinc-700">
              <Megaphone className="h-4 w-4 text-amber-500" /> {sponsorFixado.nome}
            </div>
          ) : (
            <select value={sponsorId} onChange={e => setSponsorId(e.target.value)} className={input}>
              <option value="">Selecione a empresa...</option>
              {sponsors.map(s => (
                <option key={s.id} value={s.id}>{s.nome}</option>
              ))}
            </select>
          )}
        </div>

        <div>
          <label className="text-sm font-medium text-zinc-700">Link de destino (botão "Visite")</label>
          <div className="relative">
            <Link2 className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
            <input value={linkUrl} onChange={e => setLinkUrl(e.target.value)} placeholder="https://..." className={`${input} pl-10`} />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="flex items-center gap-1.5 text-sm font-medium text-zinc-700">
              <CalendarClock className="h-4 w-4 text-amber-500" /> Início
            </label>
            <input type="datetime-local" value={startAt} onChange={e => setStartAt(e.target.value)} className={input} />
          </div>
          <div>
            <label className="flex items-center gap-1.5 text-sm font-medium text-zinc-700">
              <CalendarClock className="h-4 w-4 text-amber-500" /> Fim
            </label>
            <input type="datetime-local" value={endAt} onChange={e => setEndAt(e.target.value)} className={input} />
          </div>
        </div>
        <p className="text-xs text-zinc-500">O anúncio só aparece entre as datas preenchidas. Vazio = sem agendamento.</p>
      </div>

      <div>
        <label className="text-sm font-medium text-zinc-700">Mídia da campanha</label>
        <div className="mt-2 flex flex-wrap gap-2">
          <label className="flex cursor-pointer items-center gap-2 rounded-xl border border-zinc-300 bg-zinc-50 px-3 py-2 text-sm font-medium text-zinc-700 transition hover:bg-zinc-100">
            <ImageIcon className="h-4 w-4 text-amber-500" /> Foto
            <input type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={lerArquivo('imagem')} />
          </label>
          <label className="flex cursor-pointer items-center gap-2 rounded-xl border border-zinc-300 bg-zinc-50 px-3 py-2 text-sm font-medium text-zinc-700 transition hover:bg-zinc-100">
            <Video className="h-4 w-4 text-amber-500" /> Vídeo
            <input type="file" accept="video/mp4,video/webm" className="hidden" onChange={lerArquivo('video')} />
          </label>
          <label className="flex cursor-pointer items-center gap-2 rounded-xl border border-zinc-300 bg-zinc-50 px-3 py-2 text-sm font-medium text-zinc-700 transition hover:bg-zinc-100">
            <Music className="h-4 w-4 text-amber-500" /> Música
            <input type="file" accept="audio/mpeg,audio/mp3,audio/wav" className="hidden" onChange={lerArquivo('audio')} />
          </label>
        </div>

        <ul className="mt-2 space-y-1 text-xs text-zinc-500">
          <li>• Foto: {LIMITES.imagem.dica}</li>
          <li>• Vídeo: {LIMITES.video.dica}</li>
          <li>• Música: {LIMITES.audio.dica}</li>
        </ul>

        {media.length > 0 && (
          <div className="mt-3 space-y-2">
            {media.map(m => (
              <div key={m.id} className="flex items-center gap-3 rounded-xl border border-zinc-200 bg-white p-2 pr-3">
                <div className="h-16 w-20 shrink-0 overflow-hidden rounded-lg bg-zinc-100">
                  {m.tipo === 'imagem' && <img src={m.url} alt={m.nome} className="h-full w-full object-cover" />}
                  {m.tipo === 'video' && <video src={m.url} className="h-full w-full bg-black object-cover" />}
                  {m.tipo === 'audio' && (
                    <div className="flex h-full w-full items-center justify-center">
                      <Music2 className="h-5 w-5 text-amber-500" />
                    </div>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm font-medium text-zinc-700">{m.nome}</div>
                  <div className="text-[11px] capitalize text-zinc-400">{m.tipo}</div>
                </div>
                <button onClick={() => removerMedia(m.id)} className="rounded-full p-1.5 text-zinc-400 hover:bg-red-50 hover:text-red-500">
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        )}

        {precisaDeclaracao && (
          <label className="mt-3 flex items-start gap-2.5 rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-zinc-700">
            <input type="checkbox" checked={declaraDireitos} onChange={e => setDeclaraDireitos(e.target.checked)} className="mt-0.5 h-4 w-4 accent-amber-500" />
            <span>
              <strong className="text-amber-800">Declaração de direitos:</strong> possuo os direitos de uso deste áudio
              (próprio ou licenciado) para veiculação no portal.
            </span>
          </label>
        )}
      </div>

      <div className="flex justify-end gap-2 border-t border-zinc-100 pt-4 lg:col-span-2">
        <button onClick={onCancel} className="rounded-xl border border-zinc-300 px-5 py-2.5 text-sm font-medium text-zinc-600 transition hover:bg-zinc-50">
          Cancelar
        </button>
        <button
          onClick={salvar}
          disabled={salvando}
          className="brand-gradient rounded-xl px-6 py-2.5 text-sm font-bold text-white shadow-lg shadow-amber-500/30 transition hover:-translate-y-0.5 disabled:opacity-60"
        >
          {salvando ? 'Salvando...' : submitLabel}
        </button>
      </div>
    </div>
  );
}
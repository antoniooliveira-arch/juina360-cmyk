import { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { useToast } from '@/components/ui/Toast';
import type { Patrocinador, TipoMedia } from '@/types';
import * as api from '@/lib/supabaseService';
import { supabaseDisponivel } from '@/lib/supabaseService';
import { Plus, Pencil, Trash2, Image as ImageIcon, Video, Music, X } from 'lucide-react';

interface MediaItem {
  id: string;
  tipo: TipoMedia;
  nome: string;
  url: string;
}

export function PatrocinadoresAdmin() {
  const { patrocinadores, createPatrocinador, updatePatrocinador, deletePatrocinador } = useApp();
  const { toast } = useToast();
  const [aberto, setAberto] = useState(false);
  const [editando, setEditando] = useState<Patrocinador | null>(null);
  const [form, setForm] = useState({ nome: '', url: '', imagemUrl: '', ativo: true, media: [] as MediaItem[] });

  const abreNovo = () => {
    setAberto(true);
    setEditando(null);
    setForm({ nome: '', url: '', imagemUrl: '', ativo: true, media: [] });
  };

  const abreEdicao = (p: Patrocinador) => {
    setAberto(true);
    setEditando(p);
    setForm({
      nome: p.nome,
      url: p.url ?? '',
      imagemUrl: p.imagemUrl ?? '',
      ativo: p.ativo,
      media: (p.media ?? []).map(m => ({ id: m.id, tipo: m.tipo, nome: m.nome, url: m.url })),
    });
  };

  const lerArquivo = (tipo: TipoMedia) => async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;

    const lerComoDataUrl = (): Promise<string> =>
      new Promise(resolve => {
        const reader = new FileReader();
        reader.onload = () => resolve(String(reader.result));
        reader.readAsDataURL(file);
      });

    try {
      let url = '';
      if (supabaseDisponivel) {
        toast('info', `Enviando "${file.name}" para o Supabase...`);
        try {
          url = await api.uploadMedia(file, tipo);
        } catch (err) {
          console.warn('Upload falhou, usando local:', err);
          url = await lerComoDataUrl();
        }
      } else {
        url = await lerComoDataUrl();
      }
      const item: MediaItem = {
        id: `med-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        tipo,
        nome: file.name,
        url,
      };
      setForm(prev => ({ ...prev, media: [...prev.media, item] }));
      toast('success', `Arquivo "${file.name}" adicionado.`);
    } catch (err) {
      console.error(err);
      toast('error', 'Não foi possível ler o arquivo.');
    }
  };

  const removerMedia = (id: string) => {
    setForm(prev => ({ ...prev, media: prev.media.filter(m => m.id !== id) }));
  };

  const save = async () => {
    if (!form.nome.trim()) {
      toast('error', 'Informe o nome do patrocinador.');
      return;
    }
    const data = {
      nome: form.nome.trim(),
      url: form.url.trim() || undefined,
      imagemUrl: form.imagemUrl.trim() || undefined,
      ativo: form.ativo,
      media: form.media.map(m => ({ ...m, data: new Date() })),
    };
    try {
      if (editando) {
        await updatePatrocinador(editando.id, data);
        toast('success', 'Patrocinador atualizado.');
      } else {
        await createPatrocinador(data);
        toast('success', 'Patrocinador cadastrado.');
      }
      setAberto(false);
    } catch (e) {
      toast('error', 'Erro ao salvar patrocinador.');
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-black text-slate-900">Patrocinadores</h1>
        <button onClick={abreNovo} className="flex items-center gap-2 rounded-lg bg-amber-500 px-4 py-2 text-sm font-semibold text-slate-900 hover:bg-amber-400">
          <Plus className="h-4 w-4" /> Novo patrocinador
        </button>
      </div>

      {aberto && (
        <div className="mt-4 rounded-xl border border-zinc-200 bg-white p-6">
          <h2 className="text-lg font-bold text-slate-900">{editando ? 'Editar patrocinador' : 'Novo patrocinador'}</h2>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <div>
              <label className="text-sm font-medium text-zinc-700">Nome *</label>
              <input value={form.nome} onChange={e => setForm({ ...form, nome: e.target.value })} className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-amber-500" />
            </div>
            <div>
              <label className="text-sm font-medium text-zinc-700">URL (opcional)</label>
              <input value={form.url} onChange={e => setForm({ ...form, url: e.target.value })} placeholder="https://..." className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-amber-500" />
            </div>
            <div>
              <label className="text-sm font-medium text-zinc-700">URL da logo (opcional)</label>
              <input value={form.imagemUrl} onChange={e => setForm({ ...form, imagemUrl: e.target.value })} placeholder="https://..." className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-amber-500" />
            </div>
            <label className="flex items-end gap-2 pb-2 text-sm text-zinc-700">
              <input type="checkbox" checked={form.ativo} onChange={e => setForm({ ...form, ativo: e.target.checked })} className="h-4 w-4 rounded accent-amber-500" />
              Ativo (exibir no site)
            </label>

            <div className="md:col-span-2">
              <label className="text-sm font-medium text-zinc-700">Mídia — fotos, vídeos e músicas</label>
              <div className="mt-2 flex flex-wrap gap-2">
                <label className="flex cursor-pointer items-center gap-2 rounded-lg border border-zinc-300 bg-zinc-50 px-3 py-2 text-sm font-medium text-zinc-700 transition hover:bg-zinc-100">
                  <ImageIcon className="h-4 w-4" /> Adicionar foto
                  <input type="file" accept="image/*" className="hidden" onChange={lerArquivo('imagem')} />
                </label>
                <label className="flex cursor-pointer items-center gap-2 rounded-lg border border-zinc-300 bg-zinc-50 px-3 py-2 text-sm font-medium text-zinc-700 transition hover:bg-zinc-100">
                  <Video className="h-4 w-4" /> Adicionar vídeo
                  <input type="file" accept="video/*" className="hidden" onChange={lerArquivo('video')} />
                </label>
                <label className="flex cursor-pointer items-center gap-2 rounded-lg border border-zinc-300 bg-zinc-50 px-3 py-2 text-sm font-medium text-zinc-700 transition hover:bg-zinc-100">
                  <Music className="h-4 w-4" /> Adicionar música
                  <input type="file" accept="audio/*" className="hidden" onChange={lerArquivo('audio')} />
                </label>
              </div>

              {form.media.length > 0 && (
                <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
                  {form.media.map(m => (
                    <div key={m.id} className="group relative overflow-hidden rounded-lg border border-zinc-200 bg-zinc-50">
                      {m.tipo === 'imagem' && (
                        <img src={m.url} alt={m.nome} className="h-28 w-full object-cover" />
                      )}
                      {m.tipo === 'video' && (
                        <video src={m.url} controls className="h-28 w-full bg-black" />
                      )}
                      {m.tipo === 'audio' && (
                        <div className="flex h-28 flex-col items-center justify-center gap-2 px-3">
                          <Music className="h-7 w-7 text-zinc-400" />
                          <span className="w-full truncate text-center text-[11px] text-zinc-600">{m.nome}</span>
                          <audio src={m.url} controls className="h-6 w-full" />
                        </div>
                      )}
                      <div className="absolute inset-x-0 bottom-0 truncate bg-black/60 px-2 py-1 text-[10px] text-white">{m.nome}</div>
                      <button
                        onClick={() => removerMedia(m.id)}
                        className="absolute right-1 top-1 rounded-full bg-red-500 p-1 text-white opacity-0 shadow transition group-hover:opacity-100"
                        title="Remover"
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
              <p className="mt-2 text-xs text-zinc-500">
                {supabaseDisponivel
                  ? 'Arquivos são enviados para o Storage do Supabase e acessíveis de qualquer dispositivo.'
                  : 'Sem Supabase configurado, os arquivos ficam salvos localmente no navegador. Configure as variáveis de ambiente para armazenamento permanente.'}
              </p>
            </div>
          </div>

          <div className="mt-4 flex justify-end gap-2">
            <button onClick={() => setAberto(false)} className="rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-600 hover:bg-zinc-50">Cancelar</button>
            <button onClick={save} className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-700">Salvar</button>
          </div>
        </div>
      )}

      <div className="mt-4 overflow-hidden rounded-xl border border-zinc-200 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-zinc-200 bg-zinc-50 text-xs uppercase text-zinc-500">
            <tr>
              <th className="px-4 py-3 font-semibold">Nome</th>
              <th className="px-4 py-3 font-semibold">URL</th>
              <th className="px-4 py-3 font-semibold">Mídia</th>
              <th className="px-4 py-3 font-semibold">Status</th>
              <th className="px-4 py-3 font-semibold text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100">
            {patrocinadores.map(p => (
              <tr key={p.id} className="hover:bg-zinc-50">
                <td className="px-4 py-3 font-medium text-slate-900">{p.nome}</td>
                <td className="max-w-xs truncate px-4 py-3 text-zinc-500">{p.url ?? '—'}</td>
                <td className="px-4 py-3">
                  <div className="flex flex-wrap gap-1">
                    {p.media && p.media.length > 0 ? (
                      p.media.map(m => (
                        <span key={m.id} className="flex items-center gap-1 rounded-full bg-zinc-100 px-2 py-0.5 text-[11px] font-medium text-zinc-600">
                          {m.tipo === 'imagem' ? <ImageIcon className="h-3 w-3" /> : m.tipo === 'video' ? <Video className="h-3 w-3" /> : <Music className="h-3 w-3" />}
                          {m.nome.split('.').pop()}
                        </span>
                      ))
                    ) : (
                      <span className="text-zinc-400">—</span>
                    )}
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${p.ativo ? 'bg-emerald-100 text-emerald-700' : 'bg-zinc-100 text-zinc-600'}`}>
                    {p.ativo ? 'Ativo' : 'Inativo'}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-1">
                    <button onClick={() => abreEdicao(p)} className="rounded p-1.5 text-zinc-500 hover:bg-zinc-100"><Pencil className="h-4 w-4" /></button>
                    <button onClick={async () => { if (confirm(`Excluir "${p.nome}"?`)) { await deletePatrocinador(p.id); toast('success', 'Patrocinador excluído.'); } }} className="rounded p-1.5 text-red-500 hover:bg-red-50"><Trash2 className="h-4 w-4" /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
import { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { useToast } from '@/components/ui/Toast';
import type { Noticia, StatusNoticia } from '@/types';
import { Plus, Pencil, Trash2, X, Eye, Save } from 'lucide-react';

const statusLabels: Record<StatusNoticia, string> = {
  publicado: 'Publicada',
  rascunho: 'Rascunho',
  arquivado: 'Arquivada',
};

const statusCores: Record<StatusNoticia, string> = {
  publicado: 'bg-emerald-100 text-emerald-700',
  rascunho: 'bg-amber-100 text-amber-700',
  arquivado: 'bg-zinc-100 text-zinc-600',
};

export function NoticiasAdmin() {
  const { noticias, createNoticia, updateNoticia, deleteNoticia, categorias, currentUser } = useApp();
  const { toast } = useToast();
  const [filtro, setFiltro] = useState<'todas' | StatusNoticia>('todas');
  const [aberto, setAberto] = useState(false);
  const [editando, setEditando] = useState<Noticia | null>(null);
  const [form, setForm] = useState({
    titulo: '', resumo: '', conteudo: '', imagemUrl: '', categoriaId: '', status: 'rascunho' as StatusNoticia, destaque: false,
  });

  const abreNovo = () => {
    setEditando(null);
    setAberto(true);
    setForm({ titulo: '', resumo: '', conteudo: '', imagemUrl: '', categoriaId: '', status: 'rascunho', destaque: false });
  };

  const abreEdicao = (n: Noticia) => {
    setEditando(n);
    setAberto(true);
    setForm({
      titulo: n.titulo, resumo: n.resumo, conteudo: n.conteudo,
      imagemUrl: n.imagemUrl ?? '', categoriaId: n.categoriaId ?? '', status: n.status, destaque: n.destaque,
    });
  };

  const save = async () => {
    if (!form.titulo.trim()) {
      toast('error', 'O título é obrigatório.');
      return;
    }
    const slug = form.titulo
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9\s-]/g, '')
      .trim()
      .replace(/\s+/g, '-');

    const base = {
      titulo: form.titulo.trim(),
      slug,
      resumo: form.resumo.trim(),
      conteudo: form.conteudo.trim(),
      imagemUrl: form.imagemUrl.trim() || undefined,
      categoriaId: form.categoriaId || undefined,
      status: form.status,
      destaque: form.destaque,
      autorNome: currentUser?.nome ?? 'JUINA360º',
      autorEmail: currentUser?.email,
    };

    try {
      if (editando) {
        await updateNoticia(editando.id, base);
        toast('success', 'Notícia atualizada com sucesso.');
      } else {
        await createNoticia(base);
        toast('success', 'Notícia criada com sucesso.');
      }
      setEditando(null);
      setAberto(false);
    } catch (e) {
      toast('error', 'Erro ao salvar notícia.');
    }
  };

  const excluir = async (n: Noticia) => {
    if (!confirm(`Excluir a notícia "${n.titulo}"?`)) return;
    await deleteNoticia(n.id);
    toast('success', 'Notícia excluída.');
  };

  const lista = filtro === 'todas' ? noticias : noticias.filter(n => n.status === filtro);

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-black text-slate-900">Notícias</h1>
        <button
          onClick={abreNovo}
          className="flex items-center gap-2 rounded-lg bg-amber-500 px-4 py-2 text-sm font-semibold text-slate-900 transition hover:bg-amber-400"
        >
          <Plus className="h-4 w-4" /> Nova notícia
        </button>
      </div>

      <div className="mt-4 flex gap-2">
        {(['todas', 'publicado', 'rascunho', 'arquivado'] as const).map(f => (
          <button
            key={f}
            onClick={() => setFiltro(f)}
            className={`rounded-md px-3 py-1.5 text-sm font-medium transition ${
              filtro === f ? 'bg-slate-900 text-white' : 'bg-white text-zinc-600 hover:bg-zinc-100'
            }`}
          >
            {f === 'todas' ? 'Todas' : statusLabels[f]} ({f === 'todas' ? noticias.length : noticias.filter(n => n.status === f).length})
          </button>
        ))}
      </div>

      {aberto ? (
        <EditorForm form={form} setForm={setForm} categorias={categorias} onCancel={() => { setEditando(null); setAberto(false); }} onSave={save} editando={!!editando} />
      ) : (
        <div className="mt-4 overflow-hidden rounded-xl border border-zinc-200 bg-white">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-zinc-200 bg-zinc-50 text-xs uppercase text-zinc-500">
              <tr>
                <th className="px-4 py-3 font-semibold">Título</th>
                <th className="px-4 py-3 font-semibold">Categoria</th>
                <th className="px-4 py-3 font-semibold">Status</th>
                <th className="px-4 py-3 font-semibold">Views</th>
                <th className="px-4 py-3 font-semibold text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {lista.map(n => (
                <tr key={n.id} className="hover:bg-zinc-50">
                  <td className="max-w-md px-4 py-3">
                    <div className="flex items-center gap-2 font-medium text-slate-900">
                      {n.titulo}
                      {n.destaque && <span className="rounded bg-amber-100 px-1.5 py-0.5 text-[10px] font-bold text-amber-700">DESTAQUE</span>}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-zinc-600">{n.categoriaNome ?? '—'}</td>
                  <td className="px-4 py-3">
                    <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${statusCores[n.status]}`}>{statusLabels[n.status]}</span>
                  </td>
                  <td className="px-4 py-3 text-zinc-600">{n.views}</td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-1">
                      <button onClick={() => window.open(`/noticia/${n.slug}`, '_blank')} className="rounded p-1.5 text-zinc-500 hover:bg-zinc-100" title="Ver no site">
                        <Eye className="h-4 w-4" />
                      </button>
                      <button onClick={() => abreEdicao(n)} className="rounded p-1.5 text-zinc-500 hover:bg-zinc-100" title="Editar">
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button onClick={() => excluir(n)} className="rounded p-1.5 text-red-500 hover:bg-red-50" title="Excluir">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {lista.length === 0 && <p className="p-6 text-center text-sm text-zinc-500">Nenhuma notícia encontrada.</p>}
        </div>
      )}
    </div>
  );
}

function EditorForm({ form, setForm, categorias, onCancel, onSave, editando }: {
  form: any;
  setForm: React.Dispatch<React.SetStateAction<any>>;
  categorias: ReturnType<typeof useApp>['categorias'];
  onCancel: () => void;
  onSave: () => void;
  editando: boolean;
}) {
  return (
    <div className="mt-4 rounded-xl border border-zinc-200 bg-white p-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-slate-900">{editando ? 'Editar notícia' : 'Nova notícia'}</h2>
        <button onClick={onCancel} className="text-zinc-400 hover:text-zinc-600"><X className="h-5 w-5" /></button>
      </div>

      <div className="mt-4 grid gap-4 md:grid-cols-2">
        <div className="md:col-span-2">
          <label className="text-sm font-medium text-zinc-700">Título *</label>
          <input
            value={form.titulo}
            onChange={e => setForm({ ...form, titulo: e.target.value })}
            className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20"
          />
        </div>

        <div>
          <label className="text-sm font-medium text-zinc-700">Categoria</label>
          <select
            value={form.categoriaId}
            onChange={e => setForm({ ...form, categoriaId: e.target.value })}
            className="mt-1 w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm outline-none focus:border-amber-500"
          >
            <option value="">Sem categoria</option>
            {categorias.map(c => (
              <option key={c.id} value={c.id}>{c.nome}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-sm font-medium text-zinc-700">Status</label>
          <select
            value={form.status}
            onChange={e => setForm({ ...form, status: e.target.value })}
            className="mt-1 w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm outline-none focus:border-amber-500"
          >
            <option value="rascunho">Rascunho</option>
            <option value="publicado">Publicada</option>
            <option value="arquivado">Arquivada</option>
          </select>
        </div>

        <div className="md:col-span-2">
          <label className="text-sm font-medium text-zinc-700">Resumo</label>
          <textarea
            value={form.resumo}
            onChange={e => setForm({ ...form, resumo: e.target.value })}
            rows={2}
            className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-amber-500"
          />
        </div>

        <div className="md:col-span-2">
          <label className="text-sm font-medium text-zinc-700">URL da imagem (opcional)</label>
          <input
            value={form.imagemUrl}
            onChange={e => setForm({ ...form, imagemUrl: e.target.value })}
            placeholder="https://..."
            className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-amber-500"
          />
        </div>

        <div className="md:col-span-2">
          <label className="text-sm font-medium text-zinc-700">Conteúdo</label>
          <textarea
            value={form.conteudo}
            onChange={e => setForm({ ...form, conteudo: e.target.value })}
            rows={8}
            className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-amber-500"
          />
        </div>

        <label className="flex items-center gap-2 text-sm text-zinc-700">
          <input
            type="checkbox"
            checked={form.destaque}
            onChange={e => setForm({ ...form, destaque: e.target.checked })}
            className="h-4 w-4 rounded accent-amber-500"
          />
          Notícia em destaque na capa
        </label>
      </div>

      <div className="mt-6 flex justify-end gap-2">
        <button onClick={onCancel} className="rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-600 hover:bg-zinc-50">
          Cancelar
        </button>
        <button
          onClick={onSave}
          className="flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-700"
        >
          <Save className="h-4 w-4" /> Salvar
        </button>
      </div>
    </div>
  );
}
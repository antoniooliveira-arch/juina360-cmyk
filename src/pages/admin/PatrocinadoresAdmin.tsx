import { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { useToast } from '@/components/ui/Toast';
import type { Patrocinador } from '@/types';
import { Plus, Pencil, Trash2 } from 'lucide-react';

export function PatrocinadoresAdmin() {
  const { patrocinadores, createPatrocinador, updatePatrocinador, deletePatrocinador } = useApp();
  const { toast } = useToast();
  const [aberto, setAberto] = useState(false);
  const [editando, setEditando] = useState<Patrocinador | null>(null);
  const [form, setForm] = useState({ nome: '', url: '', imagemUrl: '', ativo: true });

  const abreNovo = () => {
    setAberto(true);
    setEditando(null);
    setForm({ nome: '', url: '', imagemUrl: '', ativo: true });
  };

  const abreEdicao = (p: Patrocinador) => {
    setAberto(true);
    setEditando(p);
    setForm({ nome: p.nome, url: p.url ?? '', imagemUrl: p.imagemUrl ?? '', ativo: p.ativo });
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
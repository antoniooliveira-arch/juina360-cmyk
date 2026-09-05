import { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { useToast } from '@/components/ui/Toast';
import type { Categoria } from '@/types';
import { Plus, Pencil, Trash2 } from 'lucide-react';

export function CategoriasAdmin() {
  const { categorias, createCategoria, updateCategoria, deleteCategoria } = useApp();
  const { toast } = useToast();
  const [nome, setNome] = useState('');
  const [editando, setEditando] = useState<Categoria | null>(null);

  const gerarSlug = (texto: string) =>
    texto.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9\s-]/g, '').trim().replace(/\s+/g, '-');

  const save = async () => {
    if (!nome.trim()) return;
    const data = { nome: nome.trim(), slug: gerarSlug(nome), ordem: editando ? editando.ordem : categorias.length + 1 };
    try {
      if (editando) {
        await updateCategoria(editando.id, data);
        toast('success', 'Categoria atualizada.');
      } else {
        await createCategoria(data);
        toast('success', 'Categoria criada.');
      }
      setNome('');
      setEditando(null);
    } catch (e) {
      toast('error', 'Erro ao salvar categoria.');
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-black text-slate-900">Categorias</h1>

      <div className="mt-4 flex items-center gap-2">
        <input
          value={nome}
          onChange={e => setNome(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && save()}
          placeholder="Nome da categoria (ex: Saúde)"
          className="w-full max-w-xs rounded-lg border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-amber-500"
        />
        <button
          onClick={save}
          className="flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-700"
        >
          <Plus className="h-4 w-4" /> {editando ? 'Atualizar' : 'Adicionar'}
        </button>
        {editando && (
          <button onClick={() => { setEditando(null); setNome(''); }} className="text-sm text-zinc-500 hover:underline">
            Cancelar edição
          </button>
        )}
      </div>

      <div className="mt-5 overflow-hidden rounded-xl border border-zinc-200 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-zinc-200 bg-zinc-50 text-xs uppercase text-zinc-500">
            <tr>
              <th className="px-4 py-3 font-semibold">Ordem</th>
              <th className="px-4 py-3 font-semibold">Nome</th>
              <th className="px-4 py-3 font-semibold">Slug</th>
              <th className="px-4 py-3 font-semibold text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100">
            {categorias.map(c => (
              <tr key={c.id} className="hover:bg-zinc-50">
                <td className="px-4 py-3 text-zinc-500">{c.ordem}</td>
                <td className="px-4 py-3 font-medium text-slate-900">{c.nome}</td>
                <td className="px-4 py-3 text-zinc-500">/{c.slug}</td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-1">
                    <button onClick={() => { setEditando(c); setNome(c.nome); }} className="rounded p-1.5 text-zinc-500 hover:bg-zinc-100">
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button
                      onClick={async () => { if (confirm(`Excluir categoria "${c.nome}"?`)) { await deleteCategoria(c.id); toast('success', 'Categoria excluída.'); } }}
                      className="rounded p-1.5 text-red-500 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
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
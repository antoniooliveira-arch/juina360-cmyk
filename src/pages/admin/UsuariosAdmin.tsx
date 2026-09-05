import { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { useToast } from '@/components/ui/Toast';
import type { Usuario, PerfilUsuario } from '@/types';
import { Plus, Pencil, Trash2 } from 'lucide-react';

const perfis: Record<PerfilUsuario, string> = {
  admin: 'Administrador',
  editor: 'Editor',
  colaborador: 'Colaborador',
  patrocinador: 'Patrocinador',
};

export function UsuariosAdmin() {
  const { usuarios, createUsuario, updateUsuario, deleteUsuario, currentUser } = useApp();
  const { toast } = useToast();
  const [aberto, setAberto] = useState(false);
  const [editando, setEditando] = useState<Usuario | null>(null);
  const [form, setForm] = useState({ nome: '', email: '', perfil: 'colaborador' as PerfilUsuario, status: 'ativo' as Usuario['status'], senha: '' });

  const abreNovo = () => {
    setAberto(true);
    setEditando(null);
    setForm({ nome: '', email: '', perfil: 'colaborador', status: 'ativo', senha: '' });
  };

  const save = async () => {
    if (!form.nome.trim() || !form.email.trim() || !form.senha) {
      toast('error', 'Preencha nome, e-mail e senha.');
      return;
    }
    try {
      if (editando) {
        await updateUsuario(editando.id, form);
        toast('success', 'Usuário atualizado.');
      } else {
        await createUsuario(form);
        toast('success', 'Usuário criado.');
      }
      setAberto(false);
    } catch (e) {
      toast('error', 'Erro ao salvar usuário.');
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-black text-slate-900">Usuários</h1>
        <button onClick={abreNovo} className="flex items-center gap-2 rounded-lg bg-amber-500 px-4 py-2 text-sm font-semibold text-slate-900 hover:bg-amber-400">
          <Plus className="h-4 w-4" /> Novo usuário
        </button>
      </div>

      {aberto && (
        <div className="mt-4 rounded-xl border border-zinc-200 bg-white p-6">
          <h2 className="text-lg font-bold text-slate-900">{editando ? 'Editar usuário' : 'Novo usuário'}</h2>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <div>
              <label className="text-sm font-medium text-zinc-700">Nome *</label>
              <input value={form.nome} onChange={e => setForm({ ...form, nome: e.target.value })} className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-amber-500" />
            </div>
            <div>
              <label className="text-sm font-medium text-zinc-700">E-mail *</label>
              <input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-amber-500" />
            </div>
            <div>
              <label className="text-sm font-medium text-zinc-700">Perfil</label>
              <select value={form.perfil} onChange={e => setForm({ ...form, perfil: e.target.value as PerfilUsuario })} className="mt-1 w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm outline-none focus:border-amber-500">
                {(Object.keys(perfis) as PerfilUsuario[]).map(p => (
                  <option key={p} value={p}>{perfis[p]}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-sm font-medium text-zinc-700">Status</label>
              <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value as Usuario['status'] })} className="mt-1 w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm outline-none focus:border-amber-500">
                <option value="ativo">Ativo</option>
                <option value="inativo">Inativo</option>
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="text-sm font-medium text-zinc-700">{editando ? 'Nova senha (deixe em branco para manter)' : 'Senha *'}</label>
              <input type="text" value={form.senha} onChange={e => setForm({ ...form, senha: e.target.value })} className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-amber-500" />
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
              <th className="px-4 py-3 font-semibold">E-mail</th>
              <th className="px-4 py-3 font-semibold">Perfil</th>
              <th className="px-4 py-3 font-semibold">Status</th>
              <th className="px-4 py-3 font-semibold text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100">
            {usuarios.map(u => (
              <tr key={u.id} className="hover:bg-zinc-50">
                <td className="px-4 py-3 font-medium text-slate-900">{u.nome}</td>
                <td className="px-4 py-3 text-zinc-600">{u.email}</td>
                <td className="px-4 py-3 text-zinc-600">{perfis[u.perfil]}</td>
                <td className="px-4 py-3">
                  <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${u.status === 'ativo' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                    {u.status === 'ativo' ? 'Ativo' : 'Inativo'}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-1">
                    <button onClick={() => { setEditando(u); setForm({ nome: u.nome, email: u.email, perfil: u.perfil, status: u.status, senha: '' }); setAberto(true); }} className="rounded p-1.5 text-zinc-500 hover:bg-zinc-100" disabled={u.id === currentUser?.id}>
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button onClick={async () => { if (confirm(`Excluir "${u.nome}"?`)) { await deleteUsuario(u.id); toast('success', 'Usuário excluído.'); } }} className="rounded p-1.5 text-red-500 hover:bg-red-50" disabled={u.id === currentUser?.id}>
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
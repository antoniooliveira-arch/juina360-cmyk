import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '@/context/AppContext';
import { useToast } from '@/components/ui/Toast';
import type { Campanha, Sponsor, StatusCampanha } from '@/types';
import { CampanhaForm, type CampanhaPayload } from '@/components/campanhas/CampanhaForm';
import { Logo } from '@/components/layout/Header';
import * as api from '@/lib/supabaseService';
import {
  Plus, Pencil, Trash2, Eye, MousePointerClick, LogOut, Globe, AudioLines, Rocket, Clock,
} from 'lucide-react';

const statusInfo: Record<StatusCampanha, { label: string; cor: string }> = {
  rascunho: { label: 'Rascunho', cor: 'bg-zinc-100 text-zinc-600' },
  pendente: { label: 'Em análise', cor: 'bg-amber-100 text-amber-700' },
  aprovado: { label: 'Aprovado', cor: 'bg-blue-100 text-blue-700' },
  publicado: { label: 'Publicado', cor: 'bg-emerald-100 text-emerald-700' },
  recusado: { label: 'Recusado', cor: 'bg-red-100 text-red-600' },
  expirado: { label: 'Expirado', cor: 'bg-zinc-200 text-zinc-600' },
};

export function PatrocinadorPainel() {
  const { campanhas, currentUser, createCampanha, updateCampanha, deleteCampanha, logout } = useApp();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [sponsor, setSponsor] = useState<Sponsor | null>(null);
  const [procurando, setProcurando] = useState(true);
  const [aberto, setAberto] = useState(false);
  const [editando, setEditando] = useState<Campanha | null>(null);

  useEffect(() => {
    if (!currentUser) return;
    (async () => {
      const found = await api.buscarSponsorPorEmail(currentUser.email);
      setSponsor(found);
      setProcurando(false);
    })();
  }, [currentUser]);

  const minhas = campanhas.filter(c => c.sponsorEmail === currentUser?.email || c.sponsorId === sponsor?.id);
  const totais = {
    views: minhas.reduce((a, c) => a + c.views, 0),
    cliques: minhas.reduce((a, c) => a + c.cliques, 0),
  };

  const salvar = async (payload: CampanhaPayload) => {
    let sponsorId = payload.sponsorId;
    if (editando) {
      await updateCampanha(editando.id, payload);
      toast('success', 'Campanha atualizada.');
    } else {
      if (!sponsorId && currentUser) {
        let sp = sponsor;
        if (!sp) sp = await api.buscarSponsorPorEmail(currentUser.email);
        if (!sp) {
          sp = await api.createSponsor({ nome: currentUser.nome, email: currentUser.email, ativo: true });
          setSponsor(sp);
        }
        sponsorId = sp.id;
      }
      await createCampanha({ ...payload, sponsorId, status: 'pendente' });
      toast('success', 'Campanha enviada para análise dos administradores.');
    }
    setAberto(false);
    setEditando(null);
  };

  const sair = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-slate-100">
      <header className="border-b border-zinc-200 bg-white">
        <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4">
          <Logo />
          <div className="flex items-center gap-2">
            <Link to="/" className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-semibold text-zinc-600 transition hover:bg-zinc-100">
              <Globe className="h-4 w-4" /> Site
            </Link>
            <button onClick={sair} className="flex items-center gap-1.5 rounded-lg bg-red-50 px-3 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-100">
              <LogOut className="h-4 w-4" /> Sair
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="font-display text-2xl font-extrabold text-slate-900">Minha campanha</h1>
            <p className="text-sm text-zinc-500">Olá, {currentUser?.nome}. Gerencie seus anúncios de forma simples.</p>
          </div>
          <button onClick={() => { setEditando(null); setAberto(true); }} className="brand-gradient flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-amber-500/30 transition hover:-translate-y-0.5">
            <Plus className="h-4 w-4" /> Nova campanha
          </button>
        </div>

        <div className="mt-5 rounded-3xl border border-zinc-200 bg-gradient-to-br from-slate-900 to-slate-800 p-6 text-white">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <div className="text-[10px] font-bold uppercase tracking-widest text-amber-400">Conta patrocinadora</div>
              <div className="mt-1 font-display text-xl font-extrabold">{sponsor?.nome ?? currentUser?.nome}</div>
              <div className="text-sm text-zinc-400">{sponsor?.email ?? currentUser?.email}</div>
            </div>
            <div className="flex gap-6">
              <div>
                <div className="flex items-center gap-1.5 text-2xl font-black"><Eye className="h-5 w-5 text-amber-400" /> {totais.views}</div>
                <div className="text-xs text-zinc-400">Visualizações</div>
              </div>
              <div>
                <div className="flex items-center gap-1.5 text-2xl font-black"><MousePointerClick className="h-5 w-5 text-amber-400" /> {totais.cliques}</div>
                <div className="text-xs text-zinc-400">Cliques</div>
              </div>
            </div>
          </div>
          <p className="mt-4 flex items-center gap-2 rounded-xl bg-white/5 px-3 py-2 text-xs text-zinc-400">
            <Rocket className="h-3.5 w-3.5 text-amber-400" />
            Após enviar, os administradores aprovam antes do anúncio ir ao ar.
          </p>
        </div>

        {aberto && (
          <div className="mt-6 rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">
            <h2 className="flex items-center gap-2 text-lg font-bold text-slate-900">
              <AudioLines className="h-5 w-5 text-amber-500" />
              {editando ? 'Editar campanha' : 'Criar nova campanha'}
            </h2>
            <div className="mt-4">
              <CampanhaForm
                initial={editando}
                sponsorFixado={sponsor ?? undefined}
                todasCampanhas={campanhas}
                campanhaAtualId={editando?.id}
                novoStatus={editando?.status ?? 'pendente'}
                submitLabel={editando ? 'Salvar alterações' : 'Enviar para análise'}
                onSave={salvar}
                onCancel={() => { setAberto(false); setEditando(null); }}
              />
            </div>
          </div>
        )}

        {!procurando && !sponsor && !aberto && (
          <div className="mt-6 flex flex-col items-center rounded-3xl border border-dashed border-zinc-300 bg-white px-6 py-12 text-center">
            <AudioLines className="h-10 w-10 text-zinc-300" />
            <h3 className="mt-3 font-bold text-slate-900">Vamos começar sua divulgação!</h3>
            <p className="mt-1 max-w-md text-sm text-zinc-500">
              Ainda não há uma ficha de empresa vinculada ao seu e-mail. Crie a primeira campanha — ela será associada automaticamente ao seu nome.
            </p>
          </div>
        )}

        <div className="mt-6 overflow-hidden rounded-2xl border border-zinc-200 bg-white">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-zinc-200 bg-zinc-50 text-xs uppercase text-zinc-500">
              <tr>
                <th className="px-4 py-3 font-semibold">Campanha</th>
                <th className="px-4 py-3 font-semibold">Status</th>
                <th className="px-4 py-3 font-semibold">Período</th>
                <th className="px-4 py-3 font-semibold">Desempenho</th>
                <th className="px-4 py-3 font-semibold text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {minhas.length === 0 && (
                <tr><td colSpan={5} className="px-4 py-12 text-center text-zinc-400">Nenhuma campanha ainda. Clique em "Nova campanha" acima.</td></tr>
              )}
              {minhas.map(c => {
                const info = statusInfo[c.status] ?? statusInfo.rascunho;
                return (
                  <tr key={c.id} className="hover:bg-zinc-50">
                    <td className="max-w-[240px] px-4 py-3">
                      <div className="truncate font-semibold text-slate-900">{c.titulo}</div>
                      {c.status === 'recusado' && c.recusaMotivo && (
                        <div className="mt-0.5 text-xs text-red-500">Motivo: {c.recusaMotivo}</div>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`flex w-fit items-center gap-1 rounded-full px-2.5 py-1 text-xs font-bold ${info.cor}`}>
                        {c.status === 'pendente' && <Clock className="h-3 w-3" />}
                        {info.label}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs text-zinc-500">
                      {c.startAt ? new Date(c.startAt).toLocaleDateString('pt-BR') : '—'} → {c.endAt ? new Date(c.endAt).toLocaleDateString('pt-BR') : '—'}
                    </td>
                    <td className="px-4 py-3 text-xs text-zinc-500">
                      <div className="flex gap-3">
                        <span className="flex items-center gap-1"><Eye className="h-3.5 w-3.5" /> {c.views}</span>
                        <span className="flex items-center gap-1"><MousePointerClick className="h-3.5 w-3.5" /> {c.cliques}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-1.5">
                        <button onClick={() => { setEditando(c); setAberto(true); }} className="rounded-lg bg-zinc-100 p-1.5 text-zinc-600 hover:bg-zinc-200"><Pencil className="h-4 w-4" /></button>
                        <button onClick={async () => { if (confirm('Excluir esta campanha?')) { await deleteCampanha(c.id); toast('success', 'Campanha excluída.'); } }} className="rounded-lg bg-red-50 p-1.5 text-red-500 hover:bg-red-100"><Trash2 className="h-4 w-4" /></button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
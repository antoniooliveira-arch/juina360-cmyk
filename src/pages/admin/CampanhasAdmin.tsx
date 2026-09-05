import { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { useToast } from '@/components/ui/Toast';
import type { Campanha, StatusCampanha, SlotId } from '@/types';
import { CampanhaForm, type CampanhaPayload } from '@/components/campanhas/CampanhaForm';
import {
  Plus, Pencil, Trash2, Eye, MousePointerClick, Image as ImageIcon, Video, Music,
  CheckCircle2, XCircle, Send, Rocket, Archive, Handshake, LayoutGrid, Wallet, TrendingUp,
} from 'lucide-react';
import { formatBRL } from '@/lib/format';

const statusInfo: Record<StatusCampanha, { label: string; cor: string }> = {
  rascunho: { label: 'Rascunho', cor: 'bg-zinc-100 text-zinc-600' },
  pendente: { label: 'Em análise', cor: 'bg-amber-100 text-amber-700' },
  aprovado: { label: 'Aprovado', cor: 'bg-blue-100 text-blue-700' },
  publicado: { label: 'Publicado', cor: 'bg-emerald-100 text-emerald-700' },
  recusado: { label: 'Recusado', cor: 'bg-red-100 text-red-600' },
  expirado: { label: 'Expirado', cor: 'bg-zinc-200 text-zinc-600' },
};

const dataCurta = (d?: Date) => (d ? new Date(d).toLocaleDateString('pt-BR') : '—');

export function CampanhasAdmin() {
  const { campanhas, sponsors, adSlots, createSponsor, createCampanha, updateCampanha, deleteCampanha } = useApp();
  const { toast } = useToast();
  const [aberto, setAberto] = useState(false);
  const [editando, setEditando] = useState<Campanha | null>(null);
  const [novoSponsor, setNovoSponsor] = useState(false);
  const [formSponsor, setFormSponsor] = useState({ nome: '', email: '', whatsapp: '' });

  const pendentes = campanhas.filter(c => c.status === 'pendente').length;
  const publicadas = campanhas.filter(c => c.status === 'publicado').length;

  const agora = Date.now();
  const ativasNaPosicao = (slotId: SlotId) =>
    campanhas.filter(c =>
      ['publicado', 'aprovado', 'pendente'].includes(c.status) &&
      c.slots?.includes(slotId) &&
      (!c.startAt || new Date(c.startAt).getTime() <= agora) &&
      (!c.endAt || new Date(c.endAt).getTime() >= agora)
    ).length;

  const resumoSlots = adSlots
    .filter(s => s.ativo)
    .map(s => {
      const ocupados = ativasNaPosicao(s.id);
      const preco = s.preco ?? 0;
      return {
        slot: s,
        ocupados,
        lotada: ocupados >= s.maxAtivos,
        receitaAtual: ocupados * preco,
        receitaPotencial: s.maxAtivos * preco,
      };
    });
  const receitaAtualTotal = resumoSlots.reduce((a, r) => a + r.receitaAtual, 0);
  const receitaPotencialTotal = resumoSlots.reduce((a, r) => a + r.receitaPotencial, 0);

  const abreNovo = () => {
    setEditando(null);
    setAberto(true);
  };

  const abreEdicao = (c: Campanha) => {
    setEditando(c);
    setAberto(true);
  };

  const salvarForm = async (payload: CampanhaPayload) => {
    if (editando) {
      await updateCampanha(editando.id, payload);
      toast('success', 'Campanha atualizada.');
    } else {
      await createCampanha(payload);
      toast('success', 'Campanha criada como rascunho.');
    }
    setAberto(false);
    setEditando(null);
  };

  const mudarStatus = async (c: Campanha, novo: StatusCampanha, motivo?: string) => {
    try {
      await updateCampanha(c.id, { status: novo, recusaMotivo: novo === 'recusado' ? motivo : undefined });
      toast('success', 'Status atualizado.');
    } catch (e) {
      toast('error', 'Erro ao atualizar.');
    }
  };

  const recusar = async (c: Campanha) => {
    const motivo = window.prompt('Motivo da recusa (aparecerá para o patrocinador):');
    if (motivo === null) return;
    await mudarStatus(c, 'recusado', motivo.trim() || 'Conteúdo em desacordo com as políticas do portal.');
  };

  const criarSponsor = async () => {
    if (!formSponsor.nome.trim()) {
      toast('error', 'Informe o nome da empresa.');
      return;
    }
    await createSponsor({ nome: formSponsor.nome.trim(), email: formSponsor.email.trim() || undefined, whatsapp: formSponsor.whatsapp.trim() || undefined, ativo: true });
    setNovoSponsor(false);
    setFormSponsor({ nome: '', email: '', whatsapp: '' });
    toast('success', 'Empresa cadastrada.');
  };

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-extrabold text-slate-900">Campanhas patrocinadas</h1>
          <p className="text-sm text-zinc-500">Crie, aprove e acompanhe os anúncios dos patrocinadores.</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setNovoSponsor(v => !v)} className="flex items-center gap-2 rounded-xl border border-zinc-300 bg-white px-4 py-2.5 text-sm font-semibold text-zinc-700 transition hover:bg-zinc-50">
            <Handshake className="h-4 w-4 text-amber-500" /> Empresa
          </button>
          <button onClick={abreNovo} className="brand-gradient flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold text-white shadow-lg shadow-amber-500/30 transition hover:-translate-y-0.5">
            <Plus className="h-4 w-4" /> Nova campanha
          </button>
        </div>
      </div>

      {novoSponsor && (
        <div className="mt-4 rounded-2xl border border-zinc-200 bg-white p-4">
          <h2 className="text-sm font-bold text-slate-900">Cadastrar empresa patrocinadora</h2>
          <div className="mt-3 grid gap-3 md:grid-cols-3">
            <input value={formSponsor.nome} onChange={e => setFormSponsor({ ...formSponsor, nome: e.target.value })} placeholder="Nome da empresa *" className="rounded-xl border border-zinc-300 bg-zinc-50 px-3 py-2 text-sm outline-none focus:border-amber-500" />
            <input value={formSponsor.email} onChange={e => setFormSponsor({ ...formSponsor, email: e.target.value })} placeholder="E-mail (login do patrocinador)" className="rounded-xl border border-zinc-300 bg-zinc-50 px-3 py-2 text-sm outline-none focus:border-amber-500" />
            <input value={formSponsor.whatsapp} onChange={e => setFormSponsor({ ...formSponsor, whatsapp: e.target.value })} placeholder="WhatsApp" className="rounded-xl border border-zinc-300 bg-zinc-50 px-3 py-2 text-sm outline-none focus:border-amber-500" />
          </div>
          <div className="mt-3 flex justify-end gap-2">
            <button onClick={() => setNovoSponsor(false)} className="rounded-xl px-4 py-2 text-sm text-zinc-500 hover:bg-zinc-50">Cancelar</button>
            <button onClick={criarSponsor} className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-700">Cadastrar</button>
          </div>
          <p className="mt-2 text-xs text-zinc-400">O e-mail precisa ser o mesmo da conta do usuário com perfil "patrocinador" para ele gerenciar as campanhas no painel.</p>
        </div>
      )}

      <div className="mt-4 grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-zinc-200 bg-white p-4">
          <div className="text-3xl font-black text-amber-600">{pendentes}</div>
          <div className="text-sm text-zinc-500">Aguardando análise</div>
        </div>
        <div className="rounded-2xl border border-zinc-200 bg-white p-4">
          <div className="text-3xl font-black text-emerald-600">{publicadas}</div>
          <div className="text-sm text-zinc-500">Publicadas</div>
        </div>
        <div className="rounded-2xl border border-zinc-200 bg-white p-4">
          <div className="text-3xl font-black text-slate-900">{campanhas.length}</div>
          <div className="text-sm text-zinc-500">Total de campanhas</div>
        </div>
      </div>

      <div className="mt-5 rounded-2xl border border-zinc-200 bg-white p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="flex items-center gap-2 text-lg font-bold text-slate-900">
            <LayoutGrid className="h-5 w-5 text-amber-500" /> Vendas por posição
          </h2>
          <div className="flex flex-wrap items-center gap-3 text-sm">
            <span className="flex items-center gap-1.5 rounded-xl bg-emerald-50 px-3 py-1.5 font-bold text-emerald-700">
              <Wallet className="h-4 w-4" /> Agora: {formatBRL(receitaAtualTotal)}/mês
            </span>
            <span className="flex items-center gap-1.5 rounded-xl bg-zinc-100 px-3 py-1.5 font-semibold text-zinc-600">
              <TrendingUp className="h-4 w-4" /> Potencial total: {formatBRL(receitaPotencialTotal)}/mês
            </span>
          </div>
        </div>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {resumoSlots.map(({ slot, ocupados, lotada, receitaAtual, receitaPotencial }) => (
            <div key={slot.id} className={`rounded-2xl border p-4 transition ${lotada ? 'border-red-200 bg-red-50/50' : 'border-zinc-200 bg-zinc-50/60'}`}>
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="text-sm font-extrabold text-slate-900">{slot.nome}</div>
                  <div className="text-[11px] text-zinc-500">{slot.formato ?? slot.posicao}</div>
                </div>
                <span className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ${lotada ? 'bg-red-100 text-red-600' : 'bg-emerald-100 text-emerald-700'}`}>
                  {lotada ? 'Lotada' : 'Disponível'}
                </span>
              </div>
              <div className="mt-2 flex items-center justify-between text-xs text-zinc-500">
                <span>{ocupados}/{slot.maxAtivos} vendidas</span>
                <span className="font-bold text-slate-900">{formatBRL(slot.preco)}</span>
              </div>
              <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-zinc-200">
                <div
                  className={`h-full rounded-full ${lotada ? 'bg-red-400' : 'bg-amber-400'}`}
                  style={{ width: `${Math.min(100, (ocupados / slot.maxAtivos) * 100)}%` }}
                />
              </div>
              <div className="mt-2 flex justify-between text-[11px] text-zinc-400">
                <span>Recebendo agora</span>
                <span className="font-semibold text-zinc-600">{formatBRL(receitaAtual)}</span>
              </div>
              <div className="flex justify-between text-[11px] text-zinc-400">
                <span>Se 100% vendido</span>
                <span className="font-semibold text-zinc-600">{formatBRL(receitaPotencial)}</span>
              </div>
            </div>
          ))}
        </div>
        <p className="mt-3 text-[11px] text-zinc-400">
          Preços podem ser ajustados diretamente na tabela <code>ad_slots</code>. A ocupação considera campanhas publicadas, aprovadas e em análise dentro do período.
        </p>
      </div>

      {aberto && (
        <div className="mt-5 rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-bold text-slate-900">{editando ? 'Editar campanha' : 'Nova campanha'}</h2>
          <div className="mt-4">
            <CampanhaForm
              initial={editando}
              sponsors={sponsors}
              todasCampanhas={campanhas}
              campanhaAtualId={editando?.id}
              novoStatus={editando?.status ?? 'rascunho'}
              submitLabel={editando ? 'Salvar alterações' : 'Criar campanha'}
              onSave={salvarForm}
              onCancel={() => { setAberto(false); setEditando(null); }}
            />
          </div>
        </div>
      )}

      <div className="mt-5 overflow-hidden rounded-2xl border border-zinc-200 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-zinc-200 bg-zinc-50 text-xs uppercase text-zinc-500">
            <tr>
              <th className="px-4 py-3 font-semibold">Campanha</th>
              <th className="px-4 py-3 font-semibold">Empresa</th>
              <th className="px-4 py-3 font-semibold">Status</th>
              <th className="px-4 py-3 font-semibold">Período</th>
              <th className="px-4 py-3 font-semibold">Posições</th>
              <th className="px-4 py-3 font-semibold">Mídia</th>
              <th className="px-4 py-3 font-semibold">Desempenho</th>
              <th className="px-4 py-3 font-semibold text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100">
            {campanhas.length === 0 && (
              <tr>
                <td colSpan={8} className="px-4 py-12 text-center text-zinc-400">Nenhuma campanha cadastrada.</td>
              </tr>
            )}
            {campanhas.map(c => {
              const info = statusInfo[c.status] ?? statusInfo.rascunho;
              return (
                <tr key={c.id} className="hover:bg-zinc-50">
                  <td className="max-w-[220px] px-4 py-3">
                    <div className="truncate font-semibold text-slate-900">{c.titulo}</div>
                    {c.status === 'recusado' && c.recusaMotivo && (
                      <div className="mt-0.5 truncate text-xs text-red-500">Motivo: {c.recusaMotivo}</div>
                    )}
                  </td>
                  <td className="px-4 py-3 text-zinc-600">{c.sponsorNome ?? '—'}</td>
                  <td className="px-4 py-3">
                    <span className={`rounded-full px-2.5 py-1 text-xs font-bold ${info.cor}`}>{info.label}</span>
                  </td>
                  <td className="px-4 py-3 text-xs text-zinc-500">
                    {dataCurta(c.startAt)} → {dataCurta(c.endAt)}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex max-w-[200px] flex-wrap gap-1">
                      {(c.slots ?? []).length === 0 && <span className="text-xs text-zinc-400">—</span>}
                      {(c.slots ?? []).map(s => (
                        <span key={s} className="rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-semibold text-amber-700">
                          {s.replace(/_/g, ' ')}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1">
                      {(c.media ?? []).map(m => (
                        <span key={m.id} className="text-zinc-400">
                          {m.tipo === 'imagem' ? <ImageIcon className="h-4 w-4" /> : m.tipo === 'video' ? <Video className="h-4 w-4" /> : <Music className="h-4 w-4" />}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3 text-xs text-zinc-500">
                      <span className="flex items-center gap-1"><Eye className="h-3.5 w-3.5" /> {c.views}</span>
                      <span className="flex items-center gap-1"><MousePointerClick className="h-3.5 w-3.5" /> {c.cliques}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1.5">
                      {c.status === 'rascunho' && (
                        <>
                          <button onClick={() => mudarStatus(c, 'pendente')} title="Enviar para análise" className="rounded-lg bg-amber-100 p-1.5 text-amber-700 hover:bg-amber-200"><Send className="h-4 w-4" /></button>
                          <button onClick={() => mudarStatus(c, 'publicado')} title="Publicar direto" className="rounded-lg bg-emerald-100 p-1.5 text-emerald-700 hover:bg-emerald-200"><Rocket className="h-4 w-4" /></button>
                        </>
                      )}
                      {c.status === 'pendente' && (
                        <>
                          <button onClick={() => mudarStatus(c, 'aprovado')} title="Aprovar" className="rounded-lg bg-blue-100 p-1.5 text-blue-700 hover:bg-blue-200"><CheckCircle2 className="h-4 w-4" /></button>
                          <button onClick={() => recusar(c)} title="Recusar" className="rounded-lg bg-red-100 p-1.5 text-red-600 hover:bg-red-200"><XCircle className="h-4 w-4" /></button>
                        </>
                      )}
                      {c.status === 'aprovado' && (
                        <>
                          <button onClick={() => mudarStatus(c, 'publicado')} title="Publicar" className="rounded-lg bg-emerald-100 p-1.5 text-emerald-700 hover:bg-emerald-200"><Rocket className="h-4 w-4" /></button>
                          <button onClick={() => recusar(c)} title="Recusar" className="rounded-lg bg-red-100 p-1.5 text-red-600 hover:bg-red-200"><XCircle className="h-4 w-4" /></button>
                        </>
                      )}
                      {c.status === 'publicado' && (
                        <button onClick={() => mudarStatus(c, 'rascunho')} title="Despublicar" className="rounded-lg bg-zinc-100 p-1.5 text-zinc-600 hover:bg-zinc-200"><Archive className="h-4 w-4" /></button>
                      )}
                      <button onClick={() => abreEdicao(c)} title="Editar" className="rounded-lg bg-zinc-100 p-1.5 text-zinc-600 hover:bg-zinc-200"><Pencil className="h-4 w-4" /></button>
                      <button onClick={async () => { if (confirm(`Excluir a campanha "${c.titulo}"?`)) { await deleteCampanha(c.id); toast('success', 'Campanha excluída.'); } }} title="Excluir" className="rounded-lg bg-red-50 p-1.5 text-red-500 hover:bg-red-100"><Trash2 className="h-4 w-4" /></button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
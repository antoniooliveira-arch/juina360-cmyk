import { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { formatBRL } from '@/lib/format';
import { linkWhatsApp } from '@/lib/contato';
import {
  Megaphone, User, Building2, Mail, MessageCircle, CheckCircle2, QrCode, Star,
  LayoutGrid, Timer, RotateCcw, ShieldCheck, ArrowRight, Radio,
} from 'lucide-react';

const formatos: Record<string, string> = {
  topo: 'Faixa 728×90',
  lateral_esquerda: 'Vertical 300×600',
  lateral_direita: 'Vertical 300×600',
  conteudo: 'Horizontal 468×60',
  destaque: 'Destaque grande',
  cards: 'Card logo',
  rodape: 'Faixa logo',
};

const PLANS = [
  {
    id: 'basico',
    nome: 'Básico',
    tagline: 'Para quem quer começar a aparecer',
    slots: ['cards', 'rodape'] as const,
    destaque: false,
    items: ['1 posição à sua escolha (cards ou rodapé)', 'Imagem do seu negócio', 'Link para seu site ou WhatsApp', 'Período definido'],
  },
  {
    id: 'premium',
    nome: 'Premium',
    tagline: 'Presença forte com vídeo',
    slots: ['topo', 'conteudo'] as const,
    destaque: true,
    items: ['2 posições (topo + dentro do conteúdo)', 'Imagem + vídeo ou música', 'Rotação prioritária', 'Estatísticas de cliques e views'],
  },
  {
    id: 'destaque',
    nome: 'Destaque',
    tagline: 'O protagonista do portal',
    slots: ['destaque', 'topo'] as const,
    destaque: false,
    items: ['Banner grande em destaque', 'Vídeo + música com equalizador', 'QR Code exclusivo para imprimir', 'Relatório completo de desempenho'],
  },
];

const passos = [
  { n: '01', titulo: 'Escolha sua posição', texto: 'Veja as posições e planos abaixo e escolha a que mais combina com seu objetivo.' },
  { n: '02', titulo: 'Envie sua arte', texto: 'Foto, vídeo ou música do seu negócio — e o link que as pessoas devem visitar.' },
  { n: '03', titulo: 'Aprovação rápida', texto: 'Nossa equipe revisa o conteúdo e aprova normalmente no mesmo dia.' },
  { n: '04', titulo: 'Sua marca em 360º', texto: 'Seu anúncio entra no ar com rotação, agendamento e métricas em tempo real.' },
];

export function Anuncie() {
  const { adSlots } = useApp();

  const precoDo = (slotId: string) => adSlots.find(s => s.id === slotId)?.preco ?? 0;
  const nomeSlots = (ids: readonly string[]) =>
    ids
      .map(id => adSlots.find(s => s.id === id)?.nome.replace('Patrocinador ', '') ?? id)
      .join(' + ');
  const precoPlano = (ids: readonly string[]) => ids.reduce((a, id) => a + precoDo(id), 0);

  const [nome, setNome] = useState('');
  const [empresa, setEmpresa] = useState('');
  const [email, setEmail] = useState('');
  const [posicao, setPosicao] = useState('destaque');
  const [mensagem, setMensagem] = useState('');

  const enviar = () => {
    const texto = [
      `Olá JUINA360º! Quero anunciar no portal.`,
      ``,
      `Nome: ${nome}`,
      empresa ? `Empresa: ${empresa}` : '',
      email ? `E-mail: ${email}` : '',
      `Posição de interesse: ${adSlots.find(s => s.id === posicao)?.nome ?? posicao}`,
      mensagem ? `Mensagem: ${mensagem}` : '',
    ]
      .filter(Boolean)
      .join('\n');
    window.open(linkWhatsApp('NOVO CONTATO DE PATROCÍNIO', texto), '_blank', 'noopener');
  };

  const planos = PLANS.map(p => ({
    ...p,
    preco: precoPlano(p.slots),
    nomePreco: nomeSlots(p.slots),
  }));

  return (
    <div className="bg-slate-50">
      <section className="brand-gradient relative overflow-hidden">
        <div className="mx-auto max-w-7xl px-4 py-16 text-center text-slate-900 md:py-20">
          <span className="inline-flex items-center gap-2 rounded-full bg-white/30 px-4 py-1.5 text-xs font-black uppercase tracking-widest">
            <Radio className="h-3.5 w-3.5" /> Espaços patrocinados disponíveis
          </span>
          <h1 className="mx-auto mt-5 max-w-3xl font-serif text-4xl font-black leading-tight md:text-5xl">
            Coloque sua marca em <span className="underline decoration-white/60 decoration-4">360 graus</span> para toda Juína
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-base font-medium text-slate-800/80 md:text-lg">
            Anuncie com o portal de notícias que acompanha a cidade em todas as direções. Vários formatos, rotação inteligente e
            métricas reais de quem viu e clicou.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <a href="#planos" className="rounded-2xl bg-slate-900 px-7 py-3.5 text-sm font-bold text-white shadow-xl shadow-slate-900/20 transition hover:-translate-y-0.5">
              Ver planos
            </a>
            <a href="#contato" className="rounded-2xl bg-white px-7 py-3.5 text-sm font-bold text-slate-900 shadow-xl shadow-black/10 transition hover:-translate-y-0.5">
              Falar com comercial
            </a>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { icon: LayoutGrid, valor: `${adSlots.filter(s => s.ativo).length}`, label: 'posições de publicidade' },
            { icon: RotateCcw, valor: 'Auto', label: 'rotação quando há mais anunciantes' },
            { icon: Timer, valor: 'Período', label: 'agendado com data de início e fim' },
            { icon: ShieldCheck, valor: 'Aprovado', label: 'conteúdo revisado pela redação' },
          ].map(s => (
            <div key={s.label} className="rounded-2xl border border-zinc-200 bg-white p-5">
              <s.icon className="h-6 w-6 text-amber-500" />
              <div className="mt-2 text-xl font-black text-slate-900">{s.valor}</div>
              <div className="text-sm text-zinc-500">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      <section id="posicoes" className="mx-auto max-w-7xl px-4 pb-12">
        <h2 className="font-display text-2xl font-extrabold text-slate-900">Posições comerciais</h2>
        <p className="mt-1 max-w-2xl text-sm text-zinc-500">
          Distribuídas pelo layout — do menu ao rodapé — para vender sem poluir a leitura. Cada posição mostra o formato e o valor mensal.
        </p>
        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {adSlots
            .filter(s => s.ativo)
            .sort((a, b) => b.preco - a.preco)
            .map(s => (
              <div key={s.id} className="rounded-2xl border border-zinc-200 bg-white p-5 transition hover:-translate-y-0.5 hover:shadow-lg hover:shadow-amber-500/5">
                <div className="flex items-start justify-between gap-2">
                  <div className="rounded-xl bg-amber-50 p-2">
                    <Megaphone className="h-5 w-5 text-amber-500" />
                  </div>
                  <span className="text-lg font-black text-slate-900">{formatBRL(s.preco)}<span className="text-xs font-semibold text-zinc-400">/mês</span></span>
                </div>
                <div className="mt-3 text-sm font-extrabold text-slate-900">{s.nome}</div>
                <div className="text-[11px] text-zinc-400">{formatos[s.id] ?? s.formato}</div>
                <p className="mt-2 text-xs text-zinc-500">{s.posicao}{s.maxAtivos > 1 ? ` · até ${s.maxAtivos} anunciantes em rotação` : ' · exclusivo'}</p>
              </div>
            ))}
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-amber-300 bg-amber-50/50 p-5 text-center">
            <QrCode className="h-6 w-6 text-amber-500" />
            <div className="mt-2 text-sm font-extrabold text-slate-900">QR Code exclusivo</div>
            <p className="mt-1 text-xs text-zinc-500">O plano Destaque gera um QR para você imprimir na vitrine.</p>
          </div>
        </div>
      </section>

      <section id="planos" className="bg-white py-12">
        <div className="mx-auto max-w-7xl px-4">
          <h2 className="text-center font-display text-3xl font-extrabold text-slate-900">Planos de patrocínio</h2>
          <p className="mx-auto mt-2 max-w-xl text-center text-sm text-zinc-500">
            Comece simples e cresça. Todos os planos incluem período definido, aprovação da equipe e métricas de views/cliques.
          </p>
          <div className="mt-8 grid gap-5 lg:grid-cols-3">
            {planos.map(p => (
              <div
                key={p.id}
                className={`relative flex flex-col rounded-3xl border p-6 transition hover:-translate-y-1 ${
                  p.destaque ? 'border-amber-400 bg-gradient-to-b from-amber-50 to-white shadow-xl shadow-amber-500/10' : 'border-zinc-200 bg-white hover:shadow-lg'
                }`}
              >
                {p.destaque && (
                  <span className="absolute -top-3 left-1/2 flex -translate-x-1/2 items-center gap-1 rounded-full bg-amber-500 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-slate-900 shadow">
                    <Star className="h-3 w-3 fill-current" /> Mais procurado
                  </span>
                )}
                <h3 className="font-display text-xl font-extrabold text-slate-900">{p.nome}</h3>
                <p className="text-xs text-zinc-500">{p.tagline}</p>
                <div className="mt-4">
                  <span className="text-4xl font-black text-slate-900">{formatBRL(p.preco)}</span>
                  <span className="text-sm font-semibold text-zinc-400">/mês</span>
                </div>
                <div className="mt-1 text-[11px] font-bold uppercase tracking-wide text-amber-600">{p.nomePreco}</div>
                <ul className="mt-4 flex-1 space-y-2">
                  {p.items.map(item => (
                    <li key={item} className="flex items-start gap-2 text-sm text-zinc-600">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" /> {item}
                    </li>
                  ))}
                </ul>
                <a
                  href={`#contato`}
                  onClick={() => setPosicao(p.slots[0])}
                  className={`mt-6 flex items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-bold transition ${
                    p.destaque ? 'brand-gradient text-white shadow-lg shadow-amber-500/30 hover:-translate-y-0.5' : 'bg-slate-900 text-white hover:bg-slate-700'
                  }`}
                >
                  Quero este plano <ArrowRight className="h-4 w-4" />
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12">
        <h2 className="font-display text-2xl font-extrabold text-slate-900">Como funciona</h2>
        <div className="mt-5 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {passos.map(p => (
            <div key={p.n} className="rounded-2xl border border-zinc-200 bg-white p-5">
              <div className="brand-gradient flex h-10 w-10 items-center justify-center rounded-xl font-black text-white">{p.n}</div>
              <div className="mt-3 font-bold text-slate-900">{p.titulo}</div>
              <p className="mt-1 text-sm text-zinc-500">{p.texto}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="contato" className="bg-slate-900 py-14">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 lg:grid-cols-2">
          <div>
            <span className="flex w-fit items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-amber-400">
              <MessageCircle className="h-3.5 w-3.5" /> Vamos conversar
            </span>
            <h2 className="mt-4 font-serif text-3xl font-black text-white">Quero anunciar no JUINA360º</h2>
            <p className="mt-3 max-w-md text-sm text-zinc-400">
              Preencha os dados e o pedido chega direto no nosso WhatsApp — sem cadastro, sem intermediários. Respondemos em horário comercial.
            </p>
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {[
                { icon: Megaphone, t: 'Formatos variados', d: 'Faixas, laterais, banner em destaque, cards e rodapé.' },
                { icon: RotateCcw, t: 'Rotação justa', d: 'Mais anunciantes que espaços? Todos se revezam com prioridade por plano.' },
                { icon: QrCode, t: 'QR Code no ar', d: 'Leve o tráfego da vitrine para a sua página com um QR exclusivo.' },
                { icon: Radio, t: 'Métricas reais', d: 'Saiba quantas pessoas viram e clicaram no seu anúncio.' },
              ].map(f => (
                <div key={f.t} className="flex items-start gap-3 rounded-2xl bg-white/5 p-4">
                  <f.icon className="mt-0.5 h-5 w-5 shrink-0 text-amber-400" />
                  <div>
                    <div className="text-sm font-bold text-white">{f.t}</div>
                    <div className="mt-0.5 text-xs text-zinc-400">{f.d}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-3xl bg-white p-6 shadow-2xl">
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block">
                <span className="text-xs font-semibold uppercase tracking-wide text-zinc-500">Seu nome *</span>
                <div className="relative mt-1">
                  <User className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
                  <input value={nome} onChange={e => setNome(e.target.value)} placeholder="Nome" className="w-full rounded-xl border border-zinc-300 bg-zinc-50 py-2.5 pl-10 pr-3 text-sm outline-none transition focus:border-amber-500 focus:ring-4 focus:ring-amber-500/15" />
                </div>
              </label>
              <label className="block">
                <span className="text-xs font-semibold uppercase tracking-wide text-zinc-500">Empresa</span>
                <div className="relative mt-1">
                  <Building2 className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
                  <input value={empresa} onChange={e => setEmpresa(e.target.value)} placeholder="Nome da empresa" className="w-full rounded-xl border border-zinc-300 bg-zinc-50 py-2.5 pl-10 pr-3 text-sm outline-none transition focus:border-amber-500 focus:ring-4 focus:ring-amber-500/15" />
                </div>
              </label>
            </div>
            <label className="mt-4 block">
              <span className="text-xs font-semibold uppercase tracking-wide text-zinc-500">E-mail</span>
              <div className="relative mt-1">
                <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
                <input value={email} onChange={e => setEmail(e.target.value)} placeholder="voce@email.com" className="w-full rounded-xl border border-zinc-300 bg-zinc-50 py-2.5 pl-10 pr-3 text-sm outline-none transition focus:border-amber-500 focus:ring-4 focus:ring-amber-500/15" />
              </div>
            </label>
            <label className="mt-4 block">
              <span className="text-xs font-semibold uppercase tracking-wide text-zinc-500">Posição de interesse *</span>
              <select
                value={posicao}
                onChange={e => setPosicao(e.target.value)}
                className="mt-1 w-full rounded-xl border border-zinc-300 bg-zinc-50 px-3 py-2.5 text-sm outline-none transition focus:border-amber-500 focus:ring-4 focus:ring-amber-500/15"
              >
                {adSlots.filter(s => s.ativo).map(s => (
                  <option key={s.id} value={s.id}>{s.nome} — {formatBRL(s.preco)}/mês</option>
                ))}
              </select>
            </label>
            <label className="mt-4 block">
              <span className="text-xs font-semibold uppercase tracking-wide text-zinc-500">Mensagem</span>
              <textarea
                value={mensagem}
                onChange={e => setMensagem(e.target.value)}
                rows={4}
                placeholder="Conte um pouco sobre a sua campanha..." 
                className="mt-1 w-full rounded-xl border border-zinc-300 bg-zinc-50 px-3 py-2.5 text-sm outline-none transition focus:border-amber-500 focus:ring-4 focus:ring-amber-500/15"
              />
            </label>
            <button
              onClick={enviar}
              className="brand-gradient mt-5 flex w-full items-center justify-center gap-2 rounded-xl px-5 py-3.5 text-sm font-bold text-white shadow-lg shadow-amber-500/30 transition hover:-translate-y-0.5"
            >
              Enviar pelo WhatsApp <MessageCircle className="h-4 w-4" />
            </button>
            <p className="mt-2 text-center text-[11px] text-zinc-400">
              Abre uma conversa no WhatsApp com o pedido pronto. Ou escreva para <a href="mailto:comercial@juina360.com" className="font-semibold text-amber-600">comercial@juina360.com</a>.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
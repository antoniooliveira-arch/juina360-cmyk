import { supabase } from './supabase';
import type { Noticia, Categoria, Patrocinador, Usuario, TipoMedia, Sponsor, Campanha, AdSlot } from '../types';

const mapNoticia = (row: any): Noticia => ({
  id: row.id,
  titulo: row.titulo,
  slug: row.slug,
  resumo: row.resumo,
  conteudo: row.conteudo,
  imagemUrl: row.imagem_url,
  categoriaId: row.categoria_id,
  categoriaNome: row.categorias?.nome,
  autorNome: row.autor_nome,
  autorEmail: row.autor_email,
  status: row.status,
  views: row.views,
  destaque: row.destaque,
  dataCriacao: new Date(row.created_at),
  dataPublicacao: row.data_publicacao ? new Date(row.data_publicacao) : undefined,
});

const mapCategoria = (row: any): Categoria => ({
  id: row.id,
  nome: row.nome,
  slug: row.slug,
  ordem: row.ordem,
});

const mapPatrocinador = (row: any): Patrocinador => ({
  id: row.id,
  nome: row.nome,
  url: row.url,
  imagemUrl: row.imagem_url,
  ativo: row.ativo,
  media: row.media ?? [],
});

const mapUsuario = (row: any): Usuario => ({
  id: row.id,
  nome: row.nome,
  email: row.email,
  perfil: row.perfil,
  status: row.status,
  senha: row.senha,
});

const mapSponsor = (row: any): Sponsor => ({
  id: row.id,
  nome: row.nome,
  email: row.email ?? undefined,
  telefone: row.telefone ?? undefined,
  whatsapp: row.whatsapp ?? undefined,
  logoUrl: row.logo_url ?? undefined,
  ativo: row.ativo,
  createdAt: row.created_at ? new Date(row.created_at) : undefined,
});

const mapCampanha = (row: any): Campanha => ({
  id: row.id,
  sponsorId: row.sponsor_id ?? undefined,
  titulo: row.titulo,
  descricao: row.descricao ?? undefined,
  linkUrl: row.link_url ?? undefined,
  media: row.media ?? [],
  slots: row.slots ?? [],
  startAt: row.start_at ? new Date(row.start_at) : undefined,
  endAt: row.end_at ? new Date(row.end_at) : undefined,
  status: row.status,
  recusaMotivo: row.recusa_motivo ?? undefined,
  views: row.views ?? 0,
  cliques: row.cliques ?? 0,
  sponsorNome: row.sponsors?.nome,
  sponsorEmail: row.sponsors?.email,
  createdAt: new Date(row.created_at),
});

export { supabaseDisponivel } from './supabase';

// ===================== CATEGORIAS =====================
export async function fetchCategorias(): Promise<Categoria[]> {
  const { data, error } = await supabase.from('categorias').select('*').order('ordem');
  if (error) throw error;
  return (data || []).map(mapCategoria);
}

export async function createCategoria(categoria: Omit<Categoria, 'id'>): Promise<Categoria> {
  const { data, error } = await supabase
    .from('categorias').insert({ nome: categoria.nome, slug: categoria.slug, ordem: categoria.ordem }).select().single();
  if (error) throw error;
  return mapCategoria(data);
}

export async function updateCategoria(id: string, data: Partial<Categoria>): Promise<void> {
  const updates: any = {};
  if (data.nome !== undefined) updates.nome = data.nome;
  if (data.slug !== undefined) updates.slug = data.slug;
  if (data.ordem !== undefined) updates.ordem = data.ordem;
  const { error } = await supabase.from('categorias').update(updates).eq('id', id);
  if (error) throw error;
}

export async function deleteCategoria(id: string): Promise<void> {
  const { error } = await supabase.from('categorias').delete().eq('id', id);
  if (error) throw error;
}

// ===================== NOTICIAS =====================
export async function fetchNoticias(opts?: { status?: string; categoriaId?: string; destaque?: boolean }): Promise<Noticia[]> {
  let query = supabase.from('noticias').select('*, categorias(nome)');
  if (opts?.status) query = query.eq('status', opts.status);
  if (opts?.categoriaId) query = query.eq('categoria_id', opts.categoriaId);
  if (opts?.destaque) query = query.eq('destaque', true);
  const { data, error } = await query.order('data_publicacao', { ascending: false }).order('created_at', { ascending: false });
  if (error) throw error;
  return (data || []).map(mapNoticia);
}

export async function fetchNoticiaBySlug(slug: string): Promise<Noticia | null> {
  const { data, error } = await supabase.from('noticias').select('*, categorias(nome)').eq('slug', slug).eq('status', 'publicado').single();
  if (error) return null;
  return mapNoticia(data);
}

export async function fetchNoticiaById(id: string): Promise<Noticia | null> {
  const { data, error } = await supabase.from('noticias').select('*, categorias(nome)').eq('id', id).single();
  if (error) return null;
  return mapNoticia(data);
}

export async function createNoticia(noticia: Omit<Noticia, 'id' | 'views' | 'dataCriacao'>): Promise<Noticia> {
  const { data, error } = await supabase
    .from('noticias')
    .insert({
      titulo: noticia.titulo,
      slug: noticia.slug,
      resumo: noticia.resumo,
      conteudo: noticia.conteudo,
      imagem_url: noticia.imagemUrl,
      categoria_id: noticia.categoriaId,
      autor_nome: noticia.autorNome,
      autor_email: noticia.autorEmail,
      status: noticia.status,
      destaque: noticia.destaque,
      data_publicacao: noticia.status === 'publicado' ? new Date().toISOString() : null,
    })
    .select('*, categorias(nome)')
    .single();
  if (error) throw error;
  return mapNoticia(data);
}

export async function updateNoticia(id: string, data: Partial<Noticia>): Promise<void> {
  const updates: any = {};
  if (data.titulo !== undefined) updates.titulo = data.titulo;
  if (data.slug !== undefined) updates.slug = data.slug;
  if (data.resumo !== undefined) updates.resumo = data.resumo;
  if (data.conteudo !== undefined) updates.conteudo = data.conteudo;
  if (data.imagemUrl !== undefined) updates.imagem_url = data.imagemUrl;
  if (data.categoriaId !== undefined) updates.categoria_id = data.categoriaId;
  if (data.status !== undefined) {
    updates.status = data.status;
    if (data.status === 'publicado') updates.data_publicacao = new Date().toISOString();
  }
  if (data.destaque !== undefined) updates.destaque = data.destaque;
  const { error } = await supabase.from('noticias').update(updates).eq('id', id);
  if (error) throw error;
}

export async function deleteNoticia(id: string): Promise<void> {
  const { error } = await supabase.from('noticias').delete().eq('id', id);
  if (error) throw error;
}

export async function incrementViews(id: string): Promise<void> {
  await supabase.rpc('incrementar_views', { noticia_id: id });
}

// ===================== PATROCINADORES =====================
export async function fetchPatrocinadores(opts?: { ativos?: boolean }): Promise<Patrocinador[]> {
  let query = supabase.from('patrocinadores').select('*');
  if (opts?.ativos) query = query.eq('ativo', true);
  const { data, error } = await query.order('nome');
  if (error) throw error;
  return (data || []).map(mapPatrocinador);
}

export async function createPatrocinador(p: Omit<Patrocinador, 'id'>): Promise<Patrocinador> {
  const { data, error } = await supabase
    .from('patrocinadores').insert({ nome: p.nome, url: p.url, imagem_url: p.imagemUrl, ativo: p.ativo, media: p.media ?? [] }).select().single();
  if (error) throw error;
  return mapPatrocinador(data);
}

export async function updatePatrocinador(id: string, data: Partial<Patrocinador>): Promise<void> {
  const updates: any = {};
  if (data.nome !== undefined) updates.nome = data.nome;
  if (data.url !== undefined) updates.url = data.url;
  if (data.imagemUrl !== undefined) updates.imagem_url = data.imagemUrl;
  if (data.ativo !== undefined) updates.ativo = data.ativo;
  if (data.media !== undefined) updates.media = data.media;
  const { error } = await supabase.from('patrocinadores').update(updates).eq('id', id);
  if (error) throw error;
}

export async function deletePatrocinador(id: string): Promise<void> {
  const { error } = await supabase.from('patrocinadores').delete().eq('id', id);
  if (error) throw error;
}

// ===================== USUÁRIOS =====================
export async function fetchUsuarios(): Promise<Usuario[]> {
  const { data, error } = await supabase.from('usuarios').select('*').order('nome');
  if (error) throw error;
  return (data || []).map(mapUsuario);
}

export async function createUsuario(u: Omit<Usuario, 'id'>): Promise<Usuario> {
  const { data, error } = await supabase
    .from('usuarios').insert({ nome: u.nome, email: u.email, perfil: u.perfil, status: u.status, senha: u.senha }).select().single();
  if (error) throw error;
  return mapUsuario(data);
}

export async function updateUsuario(id: string, data: Partial<Usuario>): Promise<void> {
  const updates: any = {};
  if (data.nome !== undefined) updates.nome = data.nome;
  if (data.email !== undefined) updates.email = data.email;
  if (data.perfil !== undefined) updates.perfil = data.perfil;
  if (data.status !== undefined) updates.status = data.status;
  if (data.senha !== undefined) updates.senha = data.senha;
  const { error } = await supabase.from('usuarios').update(updates).eq('id', id);
  if (error) throw error;
}

export async function deleteUsuario(id: string): Promise<void> {
  const { error } = await supabase.from('usuarios').delete().eq('id', id);
  if (error) throw error;
}

const mapAdSlot = (row: any): AdSlot => ({
  id: row.id,
  nome: row.nome,
  posicao: row.posicao,
  formato: row.formato ?? undefined,
  max_width: row.max_width,
  max_height: row.max_height,
  preco: Number(row.preco ?? 0),
  maxAtivos: row.max_ativos ?? 3,
  ativo: row.ativo,
});

export const AD_SLOTS: AdSlot[] = [
  { id: 'topo', nome: 'Patrocinador Topo', posicao: 'abaixo do menu', formato: 'leaderboard 728x90', max_width: 728, max_height: 90, preco: 150, maxAtivos: 3, ativo: true },
  { id: 'lateral_esquerda', nome: 'Patrocinador Lateral Esquerda', posicao: 'lateral fixa enquanto navega', formato: 'vertical 300x600', max_width: 300, max_height: 600, preco: 120, maxAtivos: 1, ativo: true },
  { id: 'lateral_direita', nome: 'Patrocinador Lateral Direita', posicao: 'lateral fixa enquanto navega', formato: 'vertical 300x600', max_width: 300, max_height: 600, preco: 120, maxAtivos: 1, ativo: true },
  { id: 'conteudo', nome: 'Patrocinador no Conteúdo', posicao: 'dentro da leitura da notícia', formato: 'horizontal 468x60', max_width: 468, max_height: 60, preco: 90, maxAtivos: 3, ativo: true },
  { id: 'destaque', nome: 'Patrocinador Destaque', posicao: 'área grande abaixo do topo', formato: 'destaque foto/vídeo', max_width: 970, max_height: 250, preco: 250, maxAtivos: 3, ativo: true },
  { id: 'cards', nome: 'Patrocinadores em Cards', posicao: 'grade de cartões na página inicial', formato: 'card logo', max_width: 250, max_height: 120, preco: 60, maxAtivos: 8, ativo: true },
  { id: 'rodape', nome: 'Patrocinador Rodapé', posicao: 'faixa fixa no rodapé', formato: 'faixa logo', max_width: 728, max_height: 60, preco: 40, maxAtivos: 6, ativo: true },
];

export async function fetchAdSlots(): Promise<AdSlot[]> {
  const { data, error } = await supabase.from('ad_slots').select('*').order('preco', { ascending: false });
  if (error || !data || data.length === 0) return AD_SLOTS;
  return data.map(mapAdSlot);
}

// ===================== CAMPANHAS PATROCINADAS =====================
export async function fetchSponsors(opts?: { ativos?: boolean }): Promise<Sponsor[]> {
  let query = supabase.from('sponsors').select('*');
  if (opts?.ativos) query = query.eq('ativo', true);
  const { data, error } = await query.order('nome');
  if (error) throw error;
  return (data || []).map(mapSponsor);
}

export async function createSponsor(s: Omit<Sponsor, 'id'>): Promise<Sponsor> {
  const { data, error } = await supabase
    .from('sponsors').insert({
      nome: s.nome,
      email: s.email ?? null,
      telefone: s.telefone ?? null,
      whatsapp: s.whatsapp ?? null,
      logo_url: s.logoUrl ?? null,
      ativo: s.ativo,
    }).select().single();
  if (error) throw error;
  return mapSponsor(data);
}

export async function updateSponsor(id: string, data: Partial<Sponsor>): Promise<void> {
  const updates: any = {};
  if (data.nome !== undefined) updates.nome = data.nome;
  if (data.email !== undefined) updates.email = data.email;
  if (data.telefone !== undefined) updates.telefone = data.telefone;
  if (data.whatsapp !== undefined) updates.whatsapp = data.whatsapp;
  if (data.logoUrl !== undefined) updates.logo_url = data.logoUrl;
  if (data.ativo !== undefined) updates.ativo = data.ativo;
  const { error } = await supabase.from('sponsors').update(updates).eq('id', id);
  if (error) throw error;
}

export async function deleteSponsor(id: string): Promise<void> {
  const { error } = await supabase.from('sponsors').delete().eq('id', id);
  if (error) throw error;
}

export async function buscarSponsorPorEmail(email: string): Promise<Sponsor | null> {
  const { data, error } = await supabase.from('sponsors').select('*').eq('email', email).maybeSingle();
  if (error || !data) return null;
  return mapSponsor(data);
}

export async function fetchCampanhas(opts?: { status?: string; sponsorId?: string }): Promise<Campanha[]> {
  let query = supabase.from('campanhas').select('*, sponsors(nome, email)').order('created_at', { ascending: false });
  if (opts?.status) query = query.eq('status', opts.status);
  if (opts?.sponsorId) query = query.eq('sponsor_id', opts.sponsorId);
  const { data, error } = await query;
  if (error) throw error;
  return (data || []).map(mapCampanha);
}

export async function createCampanha(c: Omit<Campanha, 'id' | 'views' | 'cliques' | 'createdAt'>): Promise<Campanha> {
  const { data, error } = await supabase
    .from('campanhas')
    .insert({
      sponsor_id: c.sponsorId ?? null,
      titulo: c.titulo,
      descricao: c.descricao ?? null,
      link_url: c.linkUrl ?? null,
      media: c.media ?? [],
      slots: c.slots ?? [],
      start_at: c.startAt ? new Date(c.startAt).toISOString() : null,
      end_at: c.endAt ? new Date(c.endAt).toISOString() : null,
      status: c.status,
    })
    .select('*, sponsors(nome, email)')
    .single();
  if (error) throw error;
  return mapCampanha(data);
}

export async function updateCampanha(id: string, data: Partial<Campanha>): Promise<void> {
  const updates: any = {};
  if (data.sponsorId !== undefined) updates.sponsor_id = data.sponsorId ?? null;
  if (data.titulo !== undefined) updates.titulo = data.titulo;
  if (data.descricao !== undefined) updates.descricao = data.descricao ?? null;
  if (data.linkUrl !== undefined) updates.link_url = data.linkUrl ?? null;
  if (data.media !== undefined) updates.media = data.media;
  if (data.slots !== undefined) updates.slots = data.slots;
  if (data.startAt !== undefined) updates.start_at = data.startAt ? new Date(data.startAt).toISOString() : null;
  if (data.endAt !== undefined) updates.end_at = data.endAt ? new Date(data.endAt).toISOString() : null;
  if (data.status !== undefined) updates.status = data.status;
  if (data.recusaMotivo !== undefined) updates.recusa_motivo = data.recusaMotivo ?? null;
  const { error } = await supabase.from('campanhas').update(updates).eq('id', id);
  if (error) throw error;
}

export async function deleteCampanha(id: string): Promise<void> {
  const { error } = await supabase.from('campanhas').delete().eq('id', id);
  if (error) throw error;
}

export async function registrarVisualizacaoCampanha(id: string): Promise<void> {
  await supabase.rpc('registrar_visualizacao_campanha', { campanha_id: id });
}

export async function registrarCliqueCampanha(id: string): Promise<void> {
  await supabase.rpc('registrar_clique_campanha', { campanha_id: id });
}

export async function fetchAlertasCampanha(): Promise<{ status: string; qtd: number }[]> {
  const { data, error } = await supabase
    .from('campanhas')
    .select('status')
    .in('status', ['pendente', 'aprovado', 'publicado']);
  if (error) throw error;
  const contagem: Record<string, number> = {};
  for (const r of data || []) contagem[r.status] = (contagem[r.status] ?? 0) + 1;
  return Object.entries(contagem).map(([status, qtd]) => ({ status, qtd }));
}

// ===================== STORAGE =====================
export async function uploadMedia(file: File, tipo: TipoMedia): Promise<string> {
  const ext = file.name.split('.').pop() || (tipo === 'imagem' ? 'jpg' : tipo === 'video' ? 'mp4' : 'mp3');
  const path = `${tipo}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
  const { error } = await supabase.storage
    .from('midias')
    .upload(path, file, { cacheControl: '3600', upsert: false, contentType: file.type });
  if (error) throw error;
  const { data } = supabase.storage.from('midias').getPublicUrl(path);
  return data.publicUrl;
}
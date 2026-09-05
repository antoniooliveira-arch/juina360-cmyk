import { supabase } from './supabase';
import type { Noticia, Categoria, Patrocinador, Usuario } from '../types';

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
});

const mapUsuario = (row: any): Usuario => ({
  id: row.id,
  nome: row.nome,
  email: row.email,
  perfil: row.perfil,
  status: row.status,
  senha: row.senha,
});

export const supabaseDisponivel = Boolean(import.meta.env.VITE_SUPABASE_URL);

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
    .from('patrocinadores').insert({ nome: p.nome, url: p.url, imagem_url: p.imagemUrl, ativo: p.ativo }).select().single();
  if (error) throw error;
  return mapPatrocinador(data);
}

export async function updatePatrocinador(id: string, data: Partial<Patrocinador>): Promise<void> {
  const updates: any = {};
  if (data.nome !== undefined) updates.nome = data.nome;
  if (data.url !== undefined) updates.url = data.url;
  if (data.imagemUrl !== undefined) updates.imagem_url = data.imagemUrl;
  if (data.ativo !== undefined) updates.ativo = data.ativo;
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
export type PerfilUsuario = 'admin' | 'editor' | 'colaborador';

export interface Usuario {
  id: string;
  nome: string;
  email: string;
  perfil: PerfilUsuario;
  status: 'ativo' | 'inativo';
  senha: string;
}

export interface Categoria {
  id: string;
  nome: string;
  slug: string;
  ordem: number;
}

export type StatusNoticia = 'rascunho' | 'publicado' | 'arquivado';

export interface Noticia {
  id: string;
  titulo: string;
  slug: string;
  resumo: string;
  conteudo: string;
  imagemUrl?: string;
  categoriaId?: string;
  categoriaNome?: string;
  autorNome: string;
  autorEmail?: string;
  status: StatusNoticia;
  views: number;
  destaque: boolean;
  dataCriacao: Date;
  dataPublicacao?: Date;
}

export interface Patrocinador {
  id: string;
  nome: string;
  url?: string;
  imagemUrl?: string;
  ativo: boolean;
}
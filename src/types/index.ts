export type PerfilUsuario = 'admin' | 'editor' | 'colaborador' | 'patrocinador';

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

export type TipoMedia = 'imagem' | 'video' | 'audio';

export interface PatrocinadorMedia {
  id: string;
  tipo: TipoMedia;
  nome: string;
  url: string;
  data: Date;
}

export interface Patrocinador {
  id: string;
  nome: string;
  url?: string;
  imagemUrl?: string;
  ativo: boolean;
  media?: PatrocinadorMedia[];
}

export interface Sponsor {
  id: string;
  nome: string;
  email?: string;
  telefone?: string;
  whatsapp?: string;
  logoUrl?: string;
  ativo: boolean;
  createdAt?: Date;
}

export type StatusCampanha = 'rascunho' | 'pendente' | 'aprovado' | 'publicado' | 'recusado' | 'expirado';

export type SlotId =
  | 'topo'
  | 'lateral_esquerda'
  | 'lateral_direita'
  | 'conteudo'
  | 'destaque'
  | 'cards'
  | 'rodape';

export interface AdSlot {
  id: SlotId;
  nome: string;
  posicao: string;
  formato?: string;
  max_width?: number;
  max_height?: number;
  preco: number;
  ativo: boolean;
}

export interface Campanha {
  id: string;
  sponsorId?: string;
  titulo: string;
  descricao?: string;
  linkUrl?: string;
  media?: PatrocinadorMedia[];
  slots?: SlotId[];
  startAt?: Date;
  endAt?: Date;
  status: StatusCampanha;
  recusaMotivo?: string;
  views: number;
  cliques: number;
  sponsorNome?: string;
  sponsorEmail?: string;
  createdAt: Date;
}
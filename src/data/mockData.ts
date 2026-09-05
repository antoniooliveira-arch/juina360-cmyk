import type { Noticia, Categoria, Patrocinador, Usuario } from '../types';

export const categorias: Categoria[] = [
  { id: 'cat-cidade', nome: 'Cidade', slug: 'cidade', ordem: 1 },
  { id: 'cat-politica', nome: 'Política', slug: 'politica', ordem: 2 },
  { id: 'cat-economia', nome: 'Economia', slug: 'economia', ordem: 3 },
  { id: 'cat-cultura', nome: 'Cultura', slug: 'cultura', ordem: 4 },
  { id: 'cat-esportes', nome: 'Esportes', slug: 'esportes', ordem: 5 },
];

export const usuarios: Usuario[] = [
  { id: 'usr-1', nome: 'Administrador JUINA360', email: 'admin@juina360.com', perfil: 'admin', status: 'ativo', senha: '123' },
  { id: 'usr-2', nome: 'Redator Principal', email: 'redator@juina360.com', perfil: 'editor', status: 'ativo', senha: '123456' },
  { id: 'usr-3', nome: 'Colaborador', email: 'colaborador@juina360.com', perfil: 'colaborador', status: 'ativo', senha: '123456' },
];

const diasAtras = (dias: number): Date => {
  const d = new Date();
  d.setDate(d.getDate() - dias);
  return d;
};

export const noticias: Noticia[] = [
  {
    id: 'not-1',
    titulo: 'Prefeitura anuncia novo programa de pavimentação para bairros de Juína',
    slug: 'prefeitura-anuncia-novo-programa-de-pavimentacao',
    resumo: 'Obras devem beneficiar mais de 15 bairros ao longo dos próximos meses, com investimento recorde.',
    conteudo:
      'Em coletiva realizada na manhã desta quarta-feira, a Prefeitura de Juína anunciou um novo programa de pavimentação que promete transformar a infraestrutura de dezenas de bairros da cidade.\n\nO pacote de obras contempla as regiões Norte, Leste e parte do Centro, totalizando mais de 40 quilômetros de vias a serem pavimentadas.\n\nSegundo o secretário municipal de obras, os recursos já estão garantidos e as obras começarão pelos bairros de maior fluxo de transporte escolar.\n\n"É um compromisso com a qualidade de vida da população. Ruas pavimentadas significam mais segurança, menos poeira e mais valorização dos imóveis", afirmou o prefeito.',
    categoriaId: 'cat-cidade',
    categoriaNome: 'Cidade',
    autorNome: 'Administrador JUINA360',
    status: 'publicado',
    views: 1240,
    destaque: true,
    dataCriacao: diasAtras(2),
    dataPublicacao: diasAtras(2),
  },
  {
    id: 'not-2',
    titulo: 'Feira cultural reúne produtores locais e destaca gastronomia regional',
    slug: 'feira-cultural-reune-produtores-locais',
    resumo: 'Evento no centro da cidade contou com mais de 60 estandes e apresentações musicais ao longo do fim de semana.',
    conteudo:
      'A Feira Cultural de Juína movimentou o centro da cidade durante todo o fim de semana, reunindo produtores rurais, artesãos e artistas locais.\n\nMais de 60 estandes foram montados, oferecendo desde comidas típicas até artesanato em madeira e palha.\n\nO evento, que já se tornou tradição no calendário municipal, registrou público recorde no domingo à tarde.\n\nA organização estima que mais de 8 mil pessoas tenham passado pelo local nos dois dias de festa.',
    categoriaId: 'cat-cultura',
    categoriaNome: 'Cultura',
    autorNome: 'Redator Principal',
    status: 'publicado',
    views: 856,
    destaque: true,
    dataCriacao: diasAtras(4),
    dataPublicacao: diasAtras(4),
  },
  {
    id: 'not-3',
    titulo: 'Time local garante vaga na final do campeonato regional de futebol',
    slug: 'time-local-garante-vaga-na-final',
    resumo: 'Com vitória de 2 a 1 nos pênaltis, equipe juinense se classifica para a decisão do torneio estadual.',
    conteudo:
      'Em um jogo emocionante que lotou o estádio municipal, o time local venceu nos pênaltis e garantiu vaga na grande final do campeonato regional de futebol.\n\nO placar no tempo normal ficou 1 a 1, com o gol de empate saindo aos 43 minutos do segundo tempo.\n\nNa disputa de pênaltis, o goleiro foi o herói da classificação, defendendo duas cobranças.\n\nA final está marcada para o próximo sábado e a torcida já promete comparecer em massa para apoiar a equipe.',
    categoriaId: 'cat-esportes',
    categoriaNome: 'Esportes',
    autorNome: 'Redator Principal',
    status: 'publicado',
    views: 2103,
    destaque: false,
    dataCriacao: diasAtras(1),
    dataPublicacao: diasAtras(1),
  },
  {
    id: 'not-4',
    titulo: 'Comércio local registra alta nas vendas e projeta novo semestre',
    slug: 'comercio-local-registra-alta-nas-vendas',
    resumo: 'Pesquisa da associação comercial aponta crescimento de 12% em relação ao mesmo período do ano passado.',
    conteudo:
      'O comércio de Juína vive um momento de expansão. Levantamento da associação comercial local apontou um crescimento de 12% nas vendas no último trimestre.\n\nO setor de serviços, impulsionado pela construção civil, foi o que mais contribuiu para o resultado.\n\nComerciantes entrevistados afirmam que a expectativa para o segundo semestre é ainda melhor, com a chegada de novas empresas à cidade.\n\n"Juína cresceu muito. O empreendedorismo local está mais forte do que nunca", avaliou a presidente da associação.',
    categoriaId: 'cat-economia',
    categoriaNome: 'Economia',
    autorNome: 'Colaborador',
    status: 'publicado',
    views: 634,
    destaque: false,
    dataCriacao: diasAtras(6),
    dataPublicacao: diasAtras(6),
  },
  {
    id: 'not-5',
    titulo: 'Câmara aprova projeto de incentivo à leitura nas escolas municipais',
    slug: 'camara-aprova-projeto-de-incentivo-a-leitura',
    resumo: 'Texto prevê bibliotecas itinerantes e rodas de leitura em todas as unidades da rede pública.',
    conteudo:
      'Os vereadores aprovaram nesta semana o projeto de lei que cria o programa municipal de incentivo à leitura nas escolas.\n\nEntre as medidas previstas estão a implantação de bibliotecas itinerantes, rodas de leitura semanais e a compra de acervo atualizado para todas as unidades.\n\nO projeto também cria um prêmio anual para os alunos destaques em produção literária.\n\nA expectativa é que o programa comece a funcionar já no próximo ano letivo.',
    categoriaId: 'cat-politica',
    categoriaNome: 'Política',
    autorNome: 'Colaborador',
    status: 'rascunho',
    views: 0,
    destaque: false,
    dataCriacao: diasAtras(1),
  },
];

export const patrocinadores: Patrocinador[] = [
  { id: 'pat-1', nome: 'Prefeitura de Juína', url: 'https://www.juina.mt.gov.br', ativo: true },
  { id: 'pat-2', nome: 'Câmara Municipal', ativo: true },
  { id: 'pat-3', nome: 'Associação Comercial', ativo: false },
];
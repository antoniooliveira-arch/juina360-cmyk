-- JUINA360º - Portal de Notícias
-- Cidade em 360 graus

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ===================== CATEGORIAS =====================
CREATE TABLE IF NOT EXISTS categorias (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nome VARCHAR(100) NOT NULL,
  slug VARCHAR(100) NOT NULL UNIQUE,
  ordem INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ===================== USUÁRIOS =====================
CREATE TABLE IF NOT EXISTS usuarios (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nome VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  perfil VARCHAR(20) NOT NULL CHECK (perfil IN ('admin', 'editor', 'colaborador')),
  status VARCHAR(20) NOT NULL DEFAULT 'ativo' CHECK (status IN ('ativo', 'inativo')),
  senha VARCHAR(255) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ===================== NOTÍCIAS =====================
CREATE TABLE IF NOT EXISTS noticias (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  titulo VARCHAR(255) NOT NULL,
  slug VARCHAR(255) NOT NULL UNIQUE,
  resumo TEXT,
  conteudo TEXT NOT NULL,
  imagem_url TEXT,
  categoria_id UUID REFERENCES categorias(id) ON DELETE SET NULL,
  autor_nome VARCHAR(255) NOT NULL,
  autor_email VARCHAR(255),
  status VARCHAR(20) NOT NULL DEFAULT 'rascunho' CHECK (status IN ('rascunho', 'publicado', 'arquivado')),
  views INTEGER NOT NULL DEFAULT 0,
  destaque BOOLEAN NOT NULL DEFAULT false,
  data_publicacao TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ===================== PATROCINADORES =====================
CREATE TABLE IF NOT EXISTS patrocinadores (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nome VARCHAR(255) NOT NULL,
  url TEXT,
  imagem_url TEXT,
  media JSONB NOT NULL DEFAULT '[]'::jsonb,
  ativo BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE patrocinadores ADD COLUMN IF NOT EXISTS media JSONB NOT NULL DEFAULT '[]'::jsonb;

-- ===================== ÍNDICES =====================
CREATE INDEX IF NOT EXISTS idx_noticias_status ON noticias(status);
CREATE INDEX IF NOT EXISTS idx_noticias_categoria ON noticias(categoria_id);
CREATE INDEX IF NOT EXISTS idx_noticias_slug ON noticias(slug);
CREATE INDEX IF NOT EXISTS idx_noticias_data_publicacao ON noticias(data_publicacao);

-- ===================== TRIGGER UPDATED_AT =====================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $func$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$func$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_usuarios_updated_at ON usuarios;
CREATE TRIGGER update_usuarios_updated_at BEFORE UPDATE ON usuarios FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_noticias_updated_at ON noticias;
CREATE TRIGGER update_noticias_updated_at BEFORE UPDATE ON noticias FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ===================== FUNCTION VIEWS =====================
CREATE OR REPLACE FUNCTION incrementar_views(noticia_id UUID)
RETURNS void AS $func$
BEGIN
  UPDATE noticias SET views = views + 1 WHERE id = noticia_id;
END;
$func$ language 'plpgsql';

-- ===================== SEED =====================
INSERT INTO categorias (nome, slug, ordem) VALUES
  ('Cidade', 'cidade', 1),
  ('Política', 'politica', 2),
  ('Economia', 'economia', 3),
  ('Cultura', 'cultura', 4),
  ('Esportes', 'esportes', 5)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO usuarios (nome, email, perfil, status, senha) VALUES
  ('Administrador JUINA360', 'admin@juina360.com', 'admin', 'ativo', '123'),
  ('Redator Principal', 'redator@juina360.com', 'editor', 'ativo', '123456'),
  ('Colaborador', 'colaborador@juina360.com', 'colaborador', 'ativo', '123456'),
  ('Prefeitura de Juína', 'patrocinador@juina360.com', 'patrocinador', 'ativo', '123456')
ON CONFLICT (email) DO NOTHING;

INSERT INTO patrocinadores (nome, url, ativo) VALUES
  ('Prefeitura de Juína', 'https://www.juina.mt.gov.br', true),
  ('Câmara Municipal', NULL, true)
ON CONFLICT DO NOTHING;

-- ===================== ACESSO (chave anônima) =====================
GRANT USAGE ON SCHEMA public TO anon, authenticated, service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO anon, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated, service_role;
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA public TO anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO anon, authenticated;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO anon, authenticated, service_role;

-- RLS permissivo para o portal (desenvolvimento)
ALTER TABLE categorias ENABLE ROW LEVEL SECURITY;
ALTER TABLE noticias ENABLE ROW LEVEL SECURITY;
ALTER TABLE patrocinadores ENABLE ROW LEVEL SECURITY;
ALTER TABLE usuarios ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS juina360_all_categorias ON categorias;
CREATE POLICY juina360_all_categorias ON categorias FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS juina360_all_noticias ON noticias;
CREATE POLICY juina360_all_noticias ON noticias FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS juina360_all_patrocinadores ON patrocinadores;
CREATE POLICY juina360_all_patrocinadores ON patrocinadores FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS juina360_all_usuarios ON usuarios;
CREATE POLICY juina360_all_usuarios ON usuarios FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

-- ===================== STORAGE (upload de mídia) =====================
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('midias', 'midias', true, 52428800, NULL)
ON CONFLICT (id) DO NOTHING;

-- storage.buckets/objects ficam com RLS ativo e SEM políticas por padrão:
-- sem elas o Storage API responde "Bucket not found" para a chave anônima.
DROP POLICY IF EXISTS juina360_buckets_all ON storage.buckets;
CREATE POLICY juina360_buckets_all ON storage.buckets
  FOR ALL TO anon, authenticated
  USING (id = 'midias') WITH CHECK (id = 'midias');

DROP POLICY IF EXISTS juina360_objects_all ON storage.objects;
CREATE POLICY juina360_objects_all ON storage.objects
  FOR ALL TO anon, authenticated
  USING (bucket_id = 'midias') WITH CHECK (bucket_id = 'midias');

-- ===================== CAMPANHAS PATROCINADAS =====================
-- Perfil de usuário para empresas patrocinadoras
ALTER TABLE usuarios DROP CONSTRAINT IF EXISTS usuarios_perfil_check;
ALTER TABLE usuarios ADD CONSTRAINT usuarios_perfil_check
  CHECK (perfil IN ('admin', 'editor', 'colaborador', 'patrocinador'));

CREATE TABLE IF NOT EXISTS sponsors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome TEXT NOT NULL,
  email TEXT,
  telefone TEXT,
  whatsapp TEXT,
  logo_url TEXT,
  ativo BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS campanhas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sponsor_id UUID REFERENCES sponsors(id) ON DELETE SET NULL,
  titulo TEXT NOT NULL,
  descricao TEXT,
  link_url TEXT,
  media JSONB NOT NULL DEFAULT '[]'::jsonb,
  start_at TIMESTAMPTZ,
  end_at TIMESTAMPTZ,
  status TEXT NOT NULL DEFAULT 'rascunho',
  recusa_motivo TEXT,
  views INTEGER NOT NULL DEFAULT 0,
  cliques INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ===================== POSIÇÕES COMERCIAIS (AD SLOTS) =====================
CREATE TABLE IF NOT EXISTS ad_slots (
  id TEXT PRIMARY KEY,
  nome TEXT NOT NULL,
  posicao TEXT NOT NULL,
  formato TEXT,
  max_width INTEGER,
  max_height INTEGER,
  preco NUMERIC(10,2) NOT NULL DEFAULT 0,
  max_ativos INTEGER NOT NULL DEFAULT 3,
  ativo BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

INSERT INTO ad_slots (id, nome, posicao, formato, max_width, max_height, preco, max_ativos) VALUES
  ('topo', 'Patrocinador Topo', 'abaixo do menu', 'leaderboard 728x90', 728, 90, 150.00, 3),
  ('lateral_esquerda', 'Patrocinador Lateral Esquerda', 'lateral fixa enquanto navega', 'vertical 300x600', 300, 600, 120.00, 1),
  ('lateral_direita', 'Patrocinador Lateral Direita', 'lateral fixa enquanto navega', 'vertical 300x600', 300, 600, 120.00, 1),
  ('conteudo', 'Patrocinador no Conteúdo', 'dentro da leitura da notícia', 'horizontal 468x60', 468, 60, 90.00, 3),
  ('destaque', 'Patrocinador Destaque', 'área grande abaixo do topo', 'destaque foto/vídeo', 970, 250, 250.00, 3),
  ('cards', 'Patrocinadores em Cards', 'grade de cartões na página inicial', 'card logo', 250, 120, 60.00, 8),
  ('rodape', 'Patrocinador Rodapé', 'faixa fixa no rodapé', 'faixa logo', 728, 60, 40.00, 6)
ON CONFLICT (id) DO NOTHING;

ALTER TABLE campanhas ADD COLUMN IF NOT EXISTS slots TEXT[] NOT NULL DEFAULT '{}'::text[];

CREATE INDEX IF NOT EXISTS idx_campanhas_slots ON campanhas USING GIN (slots);

ALTER TABLE ad_slots ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS juina360_all_ad_slots ON ad_slots;
CREATE POLICY juina360_all_ad_slots ON ad_slots FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

CREATE TABLE IF NOT EXISTS campaign_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id UUID REFERENCES campanhas(id) ON DELETE CASCADE,
  tipo TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_campanhas_status ON campanhas(status);
CREATE INDEX IF NOT EXISTS idx_campanhas_sponsor ON campanhas(sponsor_id);
CREATE INDEX IF NOT EXISTS idx_campaign_events_campaign ON campaign_events(campaign_id);

DROP TRIGGER IF EXISTS update_campanhas_updated_at ON campanhas;
CREATE TRIGGER update_campanhas_updated_at BEFORE UPDATE ON campanhas FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Contadores de campanha (usados pelo banner)
CREATE OR REPLACE FUNCTION registrar_visualizacao_campanha(campanha_id UUID)
RETURNS void AS $func$
BEGIN
  INSERT INTO campaign_events (campaign_id, tipo) VALUES (campanha_id, 'visualizacao');
  UPDATE campanhas SET views = views + 1 WHERE id = campanha_id;
END;
$func$ language 'plpgsql';

CREATE OR REPLACE FUNCTION registrar_clique_campanha(campanha_id UUID)
RETURNS void AS $func$
BEGIN
  INSERT INTO campaign_events (campaign_id, tipo) VALUES (campanha_id, 'clique');
  UPDATE campanhas SET cliques = cliques + 1 WHERE id = campanha_id;
END;
$func$ language 'plpgsql';

GRANT EXECUTE ON FUNCTION registrar_visualizacao_campanha TO anon, authenticated;
GRANT EXECUTE ON FUNCTION registrar_clique_campanha TO anon, authenticated;

-- Seed de exemplo: empresa + campanha publicada (preencher mídia/links no admin)
INSERT INTO sponsors (nome, email, ativo)
SELECT 'Prefeitura de Juína', 'patrocinador@juina360.com', true
WHERE NOT EXISTS (SELECT 1 FROM sponsors WHERE nome = 'Prefeitura de Juína');

INSERT INTO campanhas (sponsor_id, titulo, descricao, status, slots, start_at, end_at)
SELECT s.id, 'Campanha institucional', 'Conheça a Prefeitura de Juína e os serviços disponíveis para a população.', 'publicado', ARRAY['destaque','topo','cards','rodape'], now(), now() + interval '90 days'
FROM sponsors s WHERE s.nome = 'Prefeitura de Juína'
AND NOT EXISTS (SELECT 1 FROM campanhas WHERE titulo = 'Campanha institucional');

-- RLS permissivo (mesma política do restante do portal)
ALTER TABLE sponsors ENABLE ROW LEVEL SECURITY;
ALTER TABLE campanhas ENABLE ROW LEVEL SECURITY;
ALTER TABLE campaign_events ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS juina360_all_sponsors ON sponsors;
CREATE POLICY juina360_all_sponsors ON sponsors FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS juina360_all_campanhas ON campanhas;
CREATE POLICY juina360_all_campanhas ON campanhas FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS juina360_all_campaign_events ON campaign_events;
CREATE POLICY juina360_all_campaign_events ON campaign_events FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);
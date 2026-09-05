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
  ('Colaborador', 'colaborador@juina360.com', 'colaborador', 'ativo', '123456')
ON CONFLICT (email) DO NOTHING;

INSERT INTO patrocinadores (nome, url, ativo) VALUES
  ('Prefeitura de Juína', 'https://www.juina.mt.gov.br', true),
  ('Câmara Municipal', NULL, true)
ON CONFLICT DO NOTHING;
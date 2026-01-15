-- =====================================================
-- CADASTRO DE CLIENTES - ESTRUTURA COMPLETA DO BANCO
-- =====================================================
-- Project: Cadastro de Clientes
-- Database: PostgreSQL (Supabase)
-- Version: 1.0.0
-- =====================================================

-- Habilitar extensões necessárias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- =====================================================
-- TABELA: clientes
-- =====================================================
CREATE TABLE IF NOT EXISTS public.clientes (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  nome TEXT NOT NULL,
  email TEXT UNIQUE,
  telefone TEXT,
  cpf_cnpj TEXT UNIQUE,
  tipo_pessoa TEXT CHECK (tipo_pessoa IN ('fisica', 'juridica')),
  status TEXT DEFAULT 'ativo' CHECK (status IN ('ativo', 'inativo', 'prospect', 'cliente')),
  endereco TEXT,
  cidade TEXT,
  estado TEXT,
  cep TEXT,
  data_cadastro TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  ultima_atualizacao TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  observacoes TEXT,
  tags TEXT[],
  created_by UUID REFERENCES auth.users(id),
  CONSTRAINT clientes_nome_check CHECK (LENGTH(TRIM(nome)) >= 3)
);

-- =====================================================
-- TABELA: contatos
-- =====================================================
CREATE TABLE IF NOT EXISTS public.contatos (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  cliente_id UUID REFERENCES public.clientes(id) ON DELETE CASCADE,
  tipo TEXT NOT NULL CHECK (tipo IN ('telefone', 'email', 'whatsapp', 'outro')),
  valor TEXT NOT NULL,
  principal BOOLEAN DEFAULT false,
  observacao TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- TABELA: interacoes
-- =====================================================
CREATE TABLE IF NOT EXISTS public.interacoes (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  cliente_id UUID REFERENCES public.clientes(id) ON DELETE CASCADE,
  tipo TEXT NOT NULL CHECK (tipo IN ('ligacao', 'email', 'reuniao', 'whatsapp', 'proposta', 'outro')),
  titulo TEXT NOT NULL,
  descricao TEXT,
  data_interacao TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  proximo_contato TIMESTAMP WITH TIME ZONE,
  status TEXT DEFAULT 'concluido' CHECK (status IN ('agendado', 'concluido', 'cancelado')),
  usuario_id UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- TABELA: empresas
-- =====================================================
CREATE TABLE IF NOT EXISTS public.empresas (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  cliente_id UUID REFERENCES public.clientes(id) ON DELETE CASCADE UNIQUE,
  razao_social TEXT,
  nome_fantasia TEXT,
  cnpj TEXT UNIQUE,
  inscricao_estadual TEXT,
  inscricao_municipal TEXT,
  porte TEXT CHECK (porte IN ('MEI', 'ME', 'EPP', 'MEDIO', 'GRANDE')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- ÍNDICES PARA PERFORMANCE
-- =====================================================
CREATE INDEX IF NOT EXISTS idx_clientes_status ON public.clientes(status);
CREATE INDEX IF NOT EXISTS idx_clientes_email ON public.clientes(email);
CREATE INDEX IF NOT EXISTS idx_clientes_cpf_cnpj ON public.clientes(cpf_cnpj);
CREATE INDEX IF NOT EXISTS idx_clientes_nome ON public.clientes(nome);
CREATE INDEX IF NOT EXISTS idx_contatos_cliente ON public.contatos(cliente_id);
CREATE INDEX IF NOT EXISTS idx_contatos_tipo ON public.contatos(tipo);
CREATE INDEX IF NOT EXISTS idx_interacoes_cliente ON public.interacoes(cliente_id);
CREATE INDEX IF NOT EXISTS idx_interacoes_data ON public.interacoes(data_interacao DESC);
CREATE INDEX IF NOT EXISTS idx_interacoes_status ON public.interacoes(status);
CREATE INDEX IF NOT EXISTS idx_empresas_cnpj ON public.empresas(cnpj);
CREATE INDEX IF NOT EXISTS idx_empresas_cliente ON public.empresas(cliente_id);

-- =====================================================
-- TRIGGERS
-- =====================================================

-- Função para atualizar ultima_atualizacao
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
   NEW.ultima_atualizacao = NOW();
   RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger para clientes
DROP TRIGGER IF EXISTS update_clientes_updated_at ON public.clientes;
CREATE TRIGGER update_clientes_updated_at 
  BEFORE UPDATE ON public.clientes
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- ROW LEVEL SECURITY (RLS)
-- =====================================================

-- Habilitar RLS em todas as tabelas
ALTER TABLE public.clientes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contatos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.interacoes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.empresas ENABLE ROW LEVEL SECURITY;

-- Remover policies existentes (se houver)
DROP POLICY IF EXISTS "Usuários autenticados podem ver todos os clientes" ON public.clientes;
DROP POLICY IF EXISTS "Usuários autenticados podem criar clientes" ON public.clientes;
DROP POLICY IF EXISTS "Usuários autenticados podem atualizar clientes" ON public.clientes;
DROP POLICY IF EXISTS "Usuários autenticados podem deletar clientes" ON public.clientes;

DROP POLICY IF EXISTS "Usuários autenticados podem ver contatos" ON public.contatos;
DROP POLICY IF EXISTS "Usuários autenticados podem criar contatos" ON public.contatos;
DROP POLICY IF EXISTS "Usuários autenticados podem atualizar contatos" ON public.contatos;
DROP POLICY IF EXISTS "Usuários autenticados podem deletar contatos" ON public.contatos;

DROP POLICY IF EXISTS "Usuários autenticados podem ver interações" ON public.interacoes;
DROP POLICY IF EXISTS "Usuários autenticados podem criar interações" ON public.interacoes;
DROP POLICY IF EXISTS "Usuários autenticados podem atualizar interações" ON public.interacoes;
DROP POLICY IF EXISTS "Usuários autenticados podem deletar interações" ON public.interacoes;

DROP POLICY IF EXISTS "Usuários autenticados podem ver empresas" ON public.empresas;
DROP POLICY IF EXISTS "Usuários autenticados podem criar empresas" ON public.empresas;
DROP POLICY IF EXISTS "Usuários autenticados podem atualizar empresas" ON public.empresas;
DROP POLICY IF EXISTS "Usuários autenticados podem deletar empresas" ON public.empresas;

-- Policies para CLIENTES
CREATE POLICY "Usuários autenticados podem ver todos os clientes"
  ON public.clientes FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Usuários autenticados podem criar clientes"
  ON public.clientes FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Usuários autenticados podem atualizar clientes"
  ON public.clientes FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Usuários autenticados podem deletar clientes"
  ON public.clientes FOR DELETE
  TO authenticated
  USING (true);

-- Policies para CONTATOS
CREATE POLICY "Usuários autenticados podem ver contatos"
  ON public.contatos FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Usuários autenticados podem criar contatos"
  ON public.contatos FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Usuários autenticados podem atualizar contatos"
  ON public.contatos FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Usuários autenticados podem deletar contatos"
  ON public.contatos FOR DELETE
  TO authenticated
  USING (true);

-- Policies para INTERAÇÕES
CREATE POLICY "Usuários autenticados podem ver interações"
  ON public.interacoes FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Usuários autenticados podem criar interações"
  ON public.interacoes FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Usuários autenticados podem atualizar interações"
  ON public.interacoes FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Usuários autenticados podem deletar interações"
  ON public.interacoes FOR DELETE
  TO authenticated
  USING (true);

-- Policies para EMPRESAS
CREATE POLICY "Usuários autenticados podem ver empresas"
  ON public.empresas FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Usuários autenticados podem criar empresas"
  ON public.empresas FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Usuários autenticados podem atualizar empresas"
  ON public.empresas FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Usuários autenticados podem deletar empresas"
  ON public.empresas FOR DELETE
  TO authenticated
  USING (true);

-- =====================================================
-- DADOS DE EXEMPLO
-- =====================================================

-- Inserir clientes de exemplo
INSERT INTO public.clientes (nome, email, telefone, cpf_cnpj, tipo_pessoa, status, cidade, estado, observacoes) VALUES
('João Silva', 'joao.silva@email.com', '(11) 98765-4321', '123.456.789-00', 'fisica', 'cliente', 'São Paulo', 'SP', 'Cliente desde 2023'),
('Maria Santos', 'maria.santos@email.com', '(21) 99876-5432', '987.654.321-00', 'fisica', 'prospect', 'Rio de Janeiro', 'RJ', 'Interessada em nossos serviços'),
('Empresa Tech LTDA', 'contato@empresatech.com', '(11) 3456-7890', '12.345.678/0001-90', 'juridica', 'cliente', 'São Paulo', 'SP', 'Empresa de tecnologia')
ON CONFLICT (email) DO NOTHING;

-- =====================================================
-- COMENTÁRIOS NAS TABELAS
-- =====================================================

COMMENT ON TABLE public.clientes IS 'Cadastro principal de clientes (PF e PJ)';
COMMENT ON TABLE public.contatos IS 'Contatos adicionais dos clientes';
COMMENT ON TABLE public.interacoes IS 'Histórico de interações com clientes';
COMMENT ON TABLE public.empresas IS 'Dados complementares de empresas (PJ)';

-- =====================================================
-- FIM DO SCRIPT
-- =====================================================

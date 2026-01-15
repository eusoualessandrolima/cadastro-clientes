-- ============================================================================
-- CADASTRO DE CLIENTES - ESTRUTURA DO BANCO DE DADOS
-- ============================================================================
-- Versão: 1.0.0
-- Data: 2026-01-15
-- Descrição: Criação de todas as tabelas para sistema de gestão de clientes
-- ============================================================================

-- Habilitar extensões necessárias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================================
-- TABELA: clientes
-- Descrição: Armazena informações dos clientes
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.clientes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nome VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE,
    telefone VARCHAR(20),
    cpf_cnpj VARCHAR(18) UNIQUE,
    tipo_pessoa VARCHAR(10) CHECK (tipo_pessoa IN ('fisica', 'juridica')),
    endereco JSONB,
    observacoes TEXT,
    status VARCHAR(20) DEFAULT 'ativo' CHECK (status IN ('ativo', 'inativo', 'bloqueado')),
    data_cadastro TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    data_atualizacao TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    criado_por UUID REFERENCES auth.users(id),
    atualizado_por UUID REFERENCES auth.users(id),
    
    -- Índices
    CONSTRAINT clientes_nome_check CHECK (LENGTH(TRIM(nome)) >= 3)
);

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_clientes_nome ON public.clientes(nome);
CREATE INDEX IF NOT EXISTS idx_clientes_email ON public.clientes(email);
CREATE INDEX IF NOT EXISTS idx_clientes_cpf_cnpj ON public.clientes(cpf_cnpj);
CREATE INDEX IF NOT EXISTS idx_clientes_status ON public.clientes(status);
CREATE INDEX IF NOT EXISTS idx_clientes_data_cadastro ON public.clientes(data_cadastro DESC);

-- ============================================================================
-- TABELA: categorias
-- Descrição: Categorias para classificação de clientes
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.categorias (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nome VARCHAR(100) NOT NULL UNIQUE,
    descricao TEXT,
    cor VARCHAR(7), -- Código hexadecimal da cor
    icone VARCHAR(50),
    ativo BOOLEAN DEFAULT true,
    criado_em TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    atualizado_em TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_categorias_ativo ON public.categorias(ativo);

-- ============================================================================
-- TABELA: clientes_categorias
-- Descrição: Relacionamento muitos-para-muitos entre clientes e categorias
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.clientes_categorias (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    cliente_id UUID NOT NULL REFERENCES public.clientes(id) ON DELETE CASCADE,
    categoria_id UUID NOT NULL REFERENCES public.categorias(id) ON DELETE CASCADE,
    criado_em TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Evitar duplicatas
    UNIQUE(cliente_id, categoria_id)
);

CREATE INDEX IF NOT EXISTS idx_clientes_categorias_cliente ON public.clientes_categorias(cliente_id);
CREATE INDEX IF NOT EXISTS idx_clientes_categorias_categoria ON public.clientes_categorias(categoria_id);

-- ============================================================================
-- TABELA: contatos
-- Descrição: Múltiplos contatos para cada cliente
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.contatos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    cliente_id UUID NOT NULL REFERENCES public.clientes(id) ON DELETE CASCADE,
    nome VARCHAR(255) NOT NULL,
    cargo VARCHAR(100),
    email VARCHAR(255),
    telefone VARCHAR(20),
    whatsapp VARCHAR(20),
    preferencial BOOLEAN DEFAULT false,
    observacoes TEXT,
    criado_em TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    atualizado_em TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_contatos_cliente ON public.contatos(cliente_id);
CREATE INDEX IF NOT EXISTS idx_contatos_preferencial ON public.contatos(preferencial);

-- ============================================================================
-- TABELA: interacoes
-- Descrição: Histórico de interações com clientes
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.interacoes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    cliente_id UUID NOT NULL REFERENCES public.clientes(id) ON DELETE CASCADE,
    tipo VARCHAR(50) NOT NULL CHECK (tipo IN ('ligacao', 'email', 'reuniao', 'whatsapp', 'visita', 'outro')),
    assunto VARCHAR(255) NOT NULL,
    descricao TEXT,
    data_interacao TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    duracao_minutos INTEGER,
    resultado VARCHAR(50) CHECK (resultado IN ('positivo', 'neutro', 'negativo', 'pendente')),
    proxima_acao TEXT,
    data_proxima_acao TIMESTAMP WITH TIME ZONE,
    anexos JSONB,
    criado_por UUID REFERENCES auth.users(id),
    criado_em TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_interacoes_cliente ON public.interacoes(cliente_id);
CREATE INDEX IF NOT EXISTS idx_interacoes_tipo ON public.interacoes(tipo);
CREATE INDEX IF NOT EXISTS idx_interacoes_data ON public.interacoes(data_interacao DESC);
CREATE INDEX IF NOT EXISTS idx_interacoes_proxima_acao ON public.interacoes(data_proxima_acao);

-- ============================================================================
-- TABELA: documentos
-- Descrição: Documentos anexados aos clientes
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.documentos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    cliente_id UUID NOT NULL REFERENCES public.clientes(id) ON DELETE CASCADE,
    nome VARCHAR(255) NOT NULL,
    tipo VARCHAR(50),
    tamanho_bytes BIGINT,
    url TEXT NOT NULL,
    storage_path TEXT,
    descricao TEXT,
    tags TEXT[],
    criado_por UUID REFERENCES auth.users(id),
    criado_em TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_documentos_cliente ON public.documentos(cliente_id);
CREATE INDEX IF NOT EXISTS idx_documentos_tipo ON public.documentos(tipo);
CREATE INDEX IF NOT EXISTS idx_documentos_tags ON public.documentos USING GIN(tags);

-- ============================================================================
-- TABELA: tarefas
-- Descrição: Tarefas relacionadas aos clientes
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.tarefas (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    cliente_id UUID REFERENCES public.clientes(id) ON DELETE CASCADE,
    titulo VARCHAR(255) NOT NULL,
    descricao TEXT,
    status VARCHAR(20) DEFAULT 'pendente' CHECK (status IN ('pendente', 'em_andamento', 'concluida', 'cancelada')),
    prioridade VARCHAR(20) DEFAULT 'media' CHECK (prioridade IN ('baixa', 'media', 'alta', 'urgente')),
    data_vencimento TIMESTAMP WITH TIME ZONE,
    data_conclusao TIMESTAMP WITH TIME ZONE,
    responsavel_id UUID REFERENCES auth.users(id),
    criado_por UUID REFERENCES auth.users(id),
    criado_em TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    atualizado_em TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_tarefas_cliente ON public.tarefas(cliente_id);
CREATE INDEX IF NOT EXISTS idx_tarefas_status ON public.tarefas(status);
CREATE INDEX IF NOT EXISTS idx_tarefas_prioridade ON public.tarefas(prioridade);
CREATE INDEX IF NOT EXISTS idx_tarefas_responsavel ON public.tarefas(responsavel_id);
CREATE INDEX IF NOT EXISTS idx_tarefas_vencimento ON public.tarefas(data_vencimento);

-- ============================================================================
-- TABELA: notas
-- Descrição: Notas rápidas sobre clientes
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.notas (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    cliente_id UUID NOT NULL REFERENCES public.clientes(id) ON DELETE CASCADE,
    conteudo TEXT NOT NULL,
    fixada BOOLEAN DEFAULT false,
    cor VARCHAR(7),
    criado_por UUID REFERENCES auth.users(id),
    criado_em TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    atualizado_em TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_notas_cliente ON public.notas(cliente_id);
CREATE INDEX IF NOT EXISTS idx_notas_fixada ON public.notas(fixada);

-- ============================================================================
-- TRIGGERS: Atualizar data_atualizacao automaticamente
-- ============================================================================

-- Função para atualizar timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.atualizado_em = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Aplicar trigger nas tabelas relevantes
CREATE TRIGGER update_clientes_updated_at BEFORE UPDATE ON public.clientes
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_categorias_updated_at BEFORE UPDATE ON public.categorias
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_contatos_updated_at BEFORE UPDATE ON public.contatos
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_tarefas_updated_at BEFORE UPDATE ON public.tarefas
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_notas_updated_at BEFORE UPDATE ON public.notas
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- COMENTÁRIOS NAS TABELAS
-- ============================================================================

COMMENT ON TABLE public.clientes IS 'Cadastro principal de clientes';
COMMENT ON TABLE public.categorias IS 'Categorias para classificação de clientes';
COMMENT ON TABLE public.clientes_categorias IS 'Relacionamento entre clientes e categorias';
COMMENT ON TABLE public.contatos IS 'Contatos adicionais de cada cliente';
COMMENT ON TABLE public.interacoes IS 'Histórico de interações com clientes';
COMMENT ON TABLE public.documentos IS 'Documentos anexados aos clientes';
COMMENT ON TABLE public.tarefas IS 'Tarefas relacionadas aos clientes';
COMMENT ON TABLE public.notas IS 'Notas rápidas sobre clientes';

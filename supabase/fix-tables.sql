-- Habilitar extensões
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Criar ENUM para roles se não existir
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'app_role') THEN
        CREATE TYPE app_role AS ENUM ('admin', 'user');
    END IF;
END$$;

-- TABELA: cadastros_clientes (Usada pelo formulário/quiz)
CREATE TABLE IF NOT EXISTS public.cadastros_clientes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    nome_responsavel TEXT NOT NULL,
    nome_empresa TEXT NOT NULL,
    email_principal TEXT NOT NULL,
    fone_whatsapp TEXT NOT NULL,
    segmento_produto_servico TEXT,
    servicos_contratados TEXT[],
    modelo_contratacao TEXT,
    valor_setup NUMERIC,
    valor_mensalidade NUMERIC,
    valor_unico NUMERIC,
    forma_pagamento TEXT[],
    lembrete_pagamento BOOLEAN,
    funcao_principal TEXT[],
    perguntas_comuns TEXT,
    tom_comunicacao TEXT,
    telefone_contato TEXT,
    formas_pagamento_aceitas TEXT,
    endereco_empresa TEXT,
    instagram_empresa TEXT,
    site_empresa TEXT,
    topicos_nao_abordar TEXT,
    informacoes_produtos_servicos TEXT,
    arquivos_upload JSONB,
    status TEXT DEFAULT 'novo',
    origem TEXT,
    webhook_enviado BOOLEAN DEFAULT FALSE,
    webhook_data TIMESTAMPTZ,
    cpf_cnpj TEXT
);

-- TABELA: configuracoes_sistema
CREATE TABLE IF NOT EXISTS public.configuracoes_sistema (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    configuracoes JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id)
);

-- TABELA: user_roles
CREATE TABLE IF NOT EXISTS public.user_roles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    role app_role DEFAULT 'user',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id)
);

-- Habilitar RLS
ALTER TABLE public.cadastros_clientes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.configuracoes_sistema ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Policies para cadastros_clientes
-- Todos podem inserir (público)
CREATE POLICY "Permitir inserção pública" ON public.cadastros_clientes FOR INSERT WITH CHECK (true);
-- Apenas autenticados podem ver/editar
CREATE POLICY "Acesso total para autenticados" ON public.cadastros_clientes FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Policies para configuracoes_sistema
CREATE POLICY "Usuários podem ver suas próprias configurações" ON public.configuracoes_sistema
    FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Usuários podem atualizar suas próprias configurações" ON public.configuracoes_sistema
    FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Usuários podem inserir suas próprias configurações" ON public.configuracoes_sistema
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Policies para user_roles
CREATE POLICY "Usuários podem ver suas próprias roles" ON public.user_roles
    FOR SELECT USING (auth.uid() = user_id);

-- Índices
CREATE INDEX IF NOT EXISTS idx_cadastros_email ON public.cadastros_clientes(email_principal);
CREATE INDEX IF NOT EXISTS idx_cadastros_status ON public.cadastros_clientes(status);

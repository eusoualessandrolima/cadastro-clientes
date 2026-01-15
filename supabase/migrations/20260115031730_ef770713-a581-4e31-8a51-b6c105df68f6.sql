-- Tabela de cadastros de clientes
CREATE TABLE IF NOT EXISTS public.cadastros_clientes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  
  -- Dados da Empresa
  nome_responsavel TEXT NOT NULL,
  nome_empresa TEXT NOT NULL,
  segmento_produto_servico TEXT,
  cpf_cnpj TEXT,
  email_principal TEXT NOT NULL,
  fone_whatsapp TEXT NOT NULL,
  
  -- Dados do Acordo Comercial
  servicos_contratados TEXT[],
  modelo_contratacao TEXT,
  valor_acordado DECIMAL(10,2),
  forma_pagamento TEXT[],
  lembrete_pagamento BOOLEAN DEFAULT false,
  
  -- Personalização da IA
  funcao_principal TEXT[],
  perguntas_comuns TEXT,
  tom_comunicacao TEXT,
  solucoes_existentes TEXT[],
  
  -- Presença Digital
  telefone_contato TEXT,
  formas_pagamento_aceitas TEXT,
  endereco_empresa TEXT,
  instagram_empresa TEXT,
  site_empresa TEXT,
  topicos_nao_abordar TEXT,
  
  -- Informações Adicionais
  informacoes_produtos_servicos TEXT,
  arquivos_upload JSONB,
  
  -- Status e Metadados
  status TEXT DEFAULT 'novo',
  origem TEXT DEFAULT 'formulario_cadastro',
  webhook_enviado BOOLEAN DEFAULT false,
  webhook_data TIMESTAMP WITH TIME ZONE
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_cadastros_created_at ON public.cadastros_clientes(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_cadastros_status ON public.cadastros_clientes(status);
CREATE INDEX IF NOT EXISTS idx_cadastros_email ON public.cadastros_clientes(email_principal);

-- RLS
ALTER TABLE public.cadastros_clientes ENABLE ROW LEVEL SECURITY;

-- Permitir inserção pública (formulário)
CREATE POLICY "public_insert_cadastros"
ON public.cadastros_clientes FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- Permitir leitura apenas autenticados
CREATE POLICY "authenticated_select_cadastros"
ON public.cadastros_clientes FOR SELECT
TO authenticated
USING (true);

-- Permitir update apenas autenticados
CREATE POLICY "authenticated_update_cadastros"
ON public.cadastros_clientes FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

-- Permitir delete apenas autenticados
CREATE POLICY "authenticated_delete_cadastros"
ON public.cadastros_clientes FOR DELETE
TO authenticated
USING (true);
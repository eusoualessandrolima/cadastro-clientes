-- ============================================================================
-- CADASTRO DE CLIENTES - ROW LEVEL SECURITY (RLS)
-- ============================================================================
-- Versão: 1.0.0
-- Data: 2026-01-15
-- Descrição: Configuração de segurança e políticas de acesso
-- ============================================================================

-- ============================================================================
-- HABILITAR RLS EM TODAS AS TABELAS
-- ============================================================================

ALTER TABLE public.clientes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categorias ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clientes_categorias ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contatos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.interacoes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.documentos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tarefas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notas ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- POLÍTICAS: clientes
-- ============================================================================

-- Permitir SELECT para usuários autenticados
CREATE POLICY "Usuários autenticados podem visualizar clientes"
    ON public.clientes FOR SELECT
    TO authenticated
    USING (true);

-- Permitir INSERT para usuários autenticados
CREATE POLICY "Usuários autenticados podem criar clientes"
    ON public.clientes FOR INSERT
    TO authenticated
    WITH CHECK (true);

-- Permitir UPDATE para usuários autenticados
CREATE POLICY "Usuários autenticados podem atualizar clientes"
    ON public.clientes FOR UPDATE
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- Permitir DELETE para usuários autenticados
CREATE POLICY "Usuários autenticados podem deletar clientes"
    ON public.clientes FOR DELETE
    TO authenticated
    USING (true);

-- ============================================================================
-- POLÍTICAS: categorias
-- ============================================================================

CREATE POLICY "Usuários autenticados podem visualizar categorias"
    ON public.categorias FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Usuários autenticados podem criar categorias"
    ON public.categorias FOR INSERT
    TO authenticated
    WITH CHECK (true);

CREATE POLICY "Usuários autenticados podem atualizar categorias"
    ON public.categorias FOR UPDATE
    TO authenticated
    USING (true)
    WITH CHECK (true);

CREATE POLICY "Usuários autenticados podem deletar categorias"
    ON public.categorias FOR DELETE
    TO authenticated
    USING (true);

-- ============================================================================
-- POLÍTICAS: clientes_categorias
-- ============================================================================

CREATE POLICY "Usuários autenticados podem visualizar relações cliente-categoria"
    ON public.clientes_categorias FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Usuários autenticados podem criar relações cliente-categoria"
    ON public.clientes_categorias FOR INSERT
    TO authenticated
    WITH CHECK (true);

CREATE POLICY "Usuários autenticados podem deletar relações cliente-categoria"
    ON public.clientes_categorias FOR DELETE
    TO authenticated
    USING (true);

-- ============================================================================
-- POLÍTICAS: contatos
-- ============================================================================

CREATE POLICY "Usuários autenticados podem visualizar contatos"
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

-- ============================================================================
-- POLÍTICAS: interacoes
-- ============================================================================

CREATE POLICY "Usuários autenticados podem visualizar interações"
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

-- ============================================================================
-- POLÍTICAS: documentos
-- ============================================================================

CREATE POLICY "Usuários autenticados podem visualizar documentos"
    ON public.documentos FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Usuários autenticados podem criar documentos"
    ON public.documentos FOR INSERT
    TO authenticated
    WITH CHECK (true);

CREATE POLICY "Usuários autenticados podem atualizar documentos"
    ON public.documentos FOR UPDATE
    TO authenticated
    USING (true)
    WITH CHECK (true);

CREATE POLICY "Usuários autenticados podem deletar documentos"
    ON public.documentos FOR DELETE
    TO authenticated
    USING (true);

-- ============================================================================
-- POLÍTICAS: tarefas
-- ============================================================================

CREATE POLICY "Usuários autenticados podem visualizar tarefas"
    ON public.tarefas FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Usuários autenticados podem criar tarefas"
    ON public.tarefas FOR INSERT
    TO authenticated
    WITH CHECK (true);

CREATE POLICY "Usuários autenticados podem atualizar tarefas"
    ON public.tarefas FOR UPDATE
    TO authenticated
    USING (true)
    WITH CHECK (true);

CREATE POLICY "Usuários autenticados podem deletar tarefas"
    ON public.tarefas FOR DELETE
    TO authenticated
    USING (true);

-- ============================================================================
-- POLÍTICAS: notas
-- ============================================================================

CREATE POLICY "Usuários autenticados podem visualizar notas"
    ON public.notas FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Usuários autenticados podem criar notas"
    ON public.notas FOR INSERT
    TO authenticated
    WITH CHECK (true);

CREATE POLICY "Usuários autenticados podem atualizar notas"
    ON public.notas FOR UPDATE
    TO authenticated
    USING (true)
    WITH CHECK (true);

CREATE POLICY "Usuários autenticados podem deletar notas"
    ON public.notas FOR DELETE
    TO authenticated
    USING (true);

-- ============================================================================
-- POLÍTICAS DE STORAGE (para documentos)
-- ============================================================================

-- Bucket para documentos de clientes
INSERT INTO storage.buckets (id, name, public)
VALUES ('documentos-clientes', 'documentos-clientes', false)
ON CONFLICT (id) DO NOTHING;

-- Políticas de storage
CREATE POLICY "Usuários autenticados podem fazer upload de documentos"
    ON storage.objects FOR INSERT
    TO authenticated
    WITH CHECK (bucket_id = 'documentos-clientes');

CREATE POLICY "Usuários autenticados podem visualizar documentos"
    ON storage.objects FOR SELECT
    TO authenticated
    USING (bucket_id = 'documentos-clientes');

CREATE POLICY "Usuários autenticados podem atualizar documentos"
    ON storage.objects FOR UPDATE
    TO authenticated
    USING (bucket_id = 'documentos-clientes')
    WITH CHECK (bucket_id = 'documentos-clientes');

CREATE POLICY "Usuários autenticados podem deletar documentos"
    ON storage.objects FOR DELETE
    TO authenticated
    USING (bucket_id = 'documentos-clientes');

-- ============================================================================
-- GRANTS: Permissões para usuários autenticados
-- ============================================================================

GRANT USAGE ON SCHEMA public TO authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL FUNCTIONS IN SCHEMA public TO authenticated;

-- ============================================================================
-- COMENTÁRIOS
-- ============================================================================

COMMENT ON POLICY "Usuários autenticados podem visualizar clientes" ON public.clientes 
    IS 'Permite que usuários autenticados visualizem todos os clientes';

COMMENT ON POLICY "Usuários autenticados podem criar clientes" ON public.clientes 
    IS 'Permite que usuários autenticados criem novos clientes';

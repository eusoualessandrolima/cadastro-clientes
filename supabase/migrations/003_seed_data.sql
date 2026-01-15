-- ============================================================================
-- CADASTRO DE CLIENTES - DADOS DE EXEMPLO
-- ============================================================================
-- Versão: 1.0.0
-- Data: 2026-01-15
-- Descrição: Dados de exemplo para testes e demonstração
-- ============================================================================

-- ============================================================================
-- CATEGORIAS
-- ============================================================================

INSERT INTO public.categorias (nome, descricao, cor, icone, ativo) VALUES
('VIP', 'Clientes premium com atendimento diferenciado', '#FFD700', 'star', true),
('Corporativo', 'Empresas e clientes corporativos', '#4169E1', 'building', true),
('Varejo', 'Clientes de varejo e pequenas compras', '#32CD32', 'shopping-cart', true),
('Inadimplente', 'Clientes com pendências financeiras', '#FF4500', 'alert-circle', true),
('Prospect', 'Potenciais clientes em prospecção', '#9370DB', 'target', true),
('Inativo', 'Clientes inativos há mais de 6 meses', '#808080', 'pause-circle', true)
ON CONFLICT (nome) DO NOTHING;

-- ============================================================================
-- CLIENTES
-- ============================================================================

INSERT INTO public.clientes (nome, email, telefone, cpf_cnpj, tipo_pessoa, endereco, observacoes, status) VALUES
(
    'João Silva Comércio LTDA',
    'contato@joaosilva.com.br',
    '(11) 98765-4321',
    '12.345.678/0001-90',
    'juridica',
    '{"logradouro": "Rua das Flores", "numero": "123", "complemento": "Sala 5", "bairro": "Centro", "cidade": "São Paulo", "estado": "SP", "cep": "01234-567"}'::jsonb,
    'Cliente desde 2020. Sempre pontual nos pagamentos.',
    'ativo'
),
(
    'Maria Santos',
    'maria.santos@email.com',
    '(21) 91234-5678',
    '123.456.789-00',
    'fisica',
    '{"logradouro": "Av. Paulista", "numero": "1000", "complemento": "Apto 501", "bairro": "Bela Vista", "cidade": "São Paulo", "estado": "SP", "cep": "01310-100"}'::jsonb,
    'Cliente VIP. Preferência por atendimento via WhatsApp.',
    'ativo'
),
(
    'Tech Solutions Ltda',
    'contato@techsolutions.com.br',
    '(11) 3456-7890',
    '98.765.432/0001-10',
    'juridica',
    '{"logradouro": "Rua da Tecnologia", "numero": "500", "complemento": "Andar 10", "bairro": "Vila Olímpia", "cidade": "São Paulo", "estado": "SP", "cep": "04551-000"}'::jsonb',
    'Empresa de tecnologia. Contrato anual renovável.',
    'ativo'
),
(
    'Carlos Oliveira',
    'carlos.oliveira@gmail.com',
    '(31) 99876-5432',
    '987.654.321-00',
    'fisica',
    '{"logradouro": "Rua Minas Gerais", "numero": "250", "bairro": "Savassi", "cidade": "Belo Horizonte", "estado": "MG", "cep": "30130-100"}'::jsonb,
    'Cliente eventual. Compras sazonais.',
    'ativo'
),
(
    'Ana Paula Distribuidora',
    'ana@distribuidora.com',
    '(41) 3333-4444',
    '11.222.333/0001-44',
    'juridica',
    '{"logradouro": "Av. das Indústrias", "numero": "1500", "bairro": "CIC", "cidade": "Curitiba", "estado": "PR", "cep": "81170-000"}'::jsonb',
    'Distribuidora de médio porte. Pedidos mensais.',
    'ativo'
)
ON CONFLICT DO NOTHING;

-- ============================================================================
-- RELACIONAR CLIENTES COM CATEGORIAS
-- ============================================================================

-- Pegar IDs para relacionamento
WITH cliente_ids AS (
    SELECT id, nome FROM public.clientes
),
categoria_ids AS (
    SELECT id, nome FROM public.categorias
)
INSERT INTO public.clientes_categorias (cliente_id, categoria_id)
SELECT 
    c.id,
    cat.id
FROM cliente_ids c
CROSS JOIN categoria_ids cat
WHERE 
    (c.nome = 'João Silva Comércio LTDA' AND cat.nome = 'Corporativo') OR
    (c.nome = 'Maria Santos' AND cat.nome = 'VIP') OR
    (c.nome = 'Tech Solutions Ltda' AND cat.nome = 'Corporativo') OR
    (c.nome = 'Tech Solutions Ltda' AND cat.nome = 'VIP') OR
    (c.nome = 'Carlos Oliveira' AND cat.nome = 'Varejo') OR
    (c.nome = 'Ana Paula Distribuidora' AND cat.nome = 'Corporativo')
ON CONFLICT DO NOTHING;

-- ============================================================================
-- CONTATOS
-- ============================================================================

WITH cliente_joao AS (
    SELECT id FROM public.clientes WHERE nome = 'João Silva Comércio LTDA' LIMIT 1
),
cliente_tech AS (
    SELECT id FROM public.clientes WHERE nome = 'Tech Solutions Ltda' LIMIT 1
)
INSERT INTO public.contatos (cliente_id, nome, cargo, email, telefone, whatsapp, preferencial, observacoes)
SELECT 
    (SELECT id FROM cliente_joao),
    'João Silva',
    'Proprietário',
    'joao@joaosilva.com.br',
    '(11) 98765-4321',
    '(11) 98765-4321',
    true,
    'Contato principal. Disponível das 9h às 18h.'
UNION ALL
SELECT 
    (SELECT id FROM cliente_joao),
    'Ana Paula',
    'Gerente Financeiro',
    'financeiro@joaosilva.com.br',
    '(11) 98765-1111',
    '(11) 98765-1111',
    false,
    'Responsável por pagamentos e contratos.'
UNION ALL
SELECT 
    (SELECT id FROM cliente_tech),
    'Roberto Costa',
    'CTO',
    'roberto@techsolutions.com.br',
    '(11) 99999-8888',
    '(11) 99999-8888',
    true,
    'Decisor técnico. Preferência por reuniões online.'
ON CONFLICT DO NOTHING;

-- ============================================================================
-- INTERAÇÕES
-- ============================================================================

WITH cliente_maria AS (
    SELECT id FROM public.clientes WHERE nome = 'Maria Santos' LIMIT 1
),
cliente_tech AS (
    SELECT id FROM public.clientes WHERE nome = 'Tech Solutions Ltda' LIMIT 1
)
INSERT INTO public.interacoes (cliente_id, tipo, assunto, descricao, data_interacao, duracao_minutos, resultado, proxima_acao, data_proxima_acao)
SELECT 
    (SELECT id FROM cliente_maria),
    'ligacao',
    'Renovação de contrato',
    'Cliente interessado em renovar contrato anual com desconto. Solicitou proposta por email.',
    NOW() - INTERVAL '2 days',
    15,
    'positivo',
    'Enviar proposta comercial com 10% de desconto',
    NOW() + INTERVAL '3 days'
UNION ALL
SELECT 
    (SELECT id FROM cliente_tech),
    'reuniao',
    'Apresentação de novos produtos',
    'Reunião online para apresentar linha de produtos 2024. Participaram 3 pessoas do lado do cliente.',
    NOW() - INTERVAL '5 days',
    45,
    'positivo',
    'Aguardar retorno sobre interesse em piloto',
    NOW() + INTERVAL '7 days'
UNION ALL
SELECT 
    (SELECT id FROM cliente_maria),
    'whatsapp',
    'Dúvida sobre produto',
    'Cliente perguntou sobre disponibilidade de estoque. Informado que produto está disponível.',
    NOW() - INTERVAL '1 day',
    5,
    'neutro',
    NULL,
    NULL
ON CONFLICT DO NOTHING;

-- ============================================================================
-- TAREFAS
-- ============================================================================

WITH cliente_tech AS (
    SELECT id FROM public.clientes WHERE nome = 'Tech Solutions Ltda' LIMIT 1
),
cliente_joao AS (
    SELECT id FROM public.clientes WHERE nome = 'João Silva Comércio LTDA' LIMIT 1
)
INSERT INTO public.tarefas (cliente_id, titulo, descricao, status, prioridade, data_vencimento)
SELECT 
    (SELECT id FROM cliente_tech),
    'Enviar proposta comercial',
    'Elaborar e enviar proposta para projeto de consultoria',
    'pendente',
    'alta',
    NOW() + INTERVAL '2 days'
UNION ALL
SELECT 
    (SELECT id FROM cliente_joao),
    'Agendar visita técnica',
    'Agendar visita para avaliação de necessidades',
    'em_andamento',
    'media',
    NOW() + INTERVAL '5 days'
UNION ALL
SELECT 
    (SELECT id FROM cliente_tech),
    'Follow-up reunião',
    'Fazer follow-up da reunião de apresentação',
    'pendente',
    'alta',
    NOW() + INTERVAL '1 day'
ON CONFLICT DO NOTHING;

-- ============================================================================
-- NOTAS
-- ============================================================================

WITH cliente_maria AS (
    SELECT id FROM public.clientes WHERE nome = 'Maria Santos' LIMIT 1
),
cliente_carlos AS (
    SELECT id FROM public.clientes WHERE nome = 'Carlos Oliveira' LIMIT 1
)
INSERT INTO public.notas (cliente_id, conteudo, fixada, cor)
SELECT 
    (SELECT id FROM cliente_maria),
    'Cliente VIP - sempre oferecer condições especiais',
    true,
    '#FFD700'
UNION ALL
SELECT 
    (SELECT id FROM cliente_carlos),
    'Preferência por contato via email. Não ligar antes das 14h.',
    false,
    '#87CEEB'
ON CONFLICT DO NOTHING;

-- ============================================================================
-- ESTATÍSTICAS
-- ============================================================================

-- Verificar dados inseridos
DO $$
DECLARE
    total_clientes INTEGER;
    total_categorias INTEGER;
    total_contatos INTEGER;
    total_interacoes INTEGER;
    total_tarefas INTEGER;
    total_notas INTEGER;
BEGIN
    SELECT COUNT(*) INTO total_clientes FROM public.clientes;
    SELECT COUNT(*) INTO total_categorias FROM public.categorias;
    SELECT COUNT(*) INTO total_contatos FROM public.contatos;
    SELECT COUNT(*) INTO total_interacoes FROM public.interacoes;
    SELECT COUNT(*) INTO total_tarefas FROM public.tarefas;
    SELECT COUNT(*) INTO total_notas FROM public.notas;
    
    RAISE NOTICE '========================================';
    RAISE NOTICE 'DADOS DE EXEMPLO INSERIDOS COM SUCESSO';
    RAISE NOTICE '========================================';
    RAISE NOTICE 'Clientes: %', total_clientes;
    RAISE NOTICE 'Categorias: %', total_categorias;
    RAISE NOTICE 'Contatos: %', total_contatos;
    RAISE NOTICE 'Interações: %', total_interacoes;
    RAISE NOTICE 'Tarefas: %', total_tarefas;
    RAISE NOTICE 'Notas: %', total_notas;
    RAISE NOTICE '========================================';
END $$;

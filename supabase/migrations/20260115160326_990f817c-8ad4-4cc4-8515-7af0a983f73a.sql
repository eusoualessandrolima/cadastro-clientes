-- Adicionar coluna de observações sobre o valor
ALTER TABLE public.cadastros_clientes 
ADD COLUMN IF NOT EXISTS observacoes_valor TEXT;

-- Comentário na coluna
COMMENT ON COLUMN public.cadastros_clientes.observacoes_valor IS 'Observações sobre o valor acordado: descontos, condições especiais, parcelamento, etc.';
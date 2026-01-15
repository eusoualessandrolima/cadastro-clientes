-- Remove old value columns
ALTER TABLE public.cadastros_clientes 
DROP COLUMN IF EXISTS valor_acordado,
DROP COLUMN IF EXISTS observacoes_valor;

-- Add new value columns for dynamic pricing based on contract model
ALTER TABLE public.cadastros_clientes 
ADD COLUMN IF NOT EXISTS valor_setup DECIMAL(10,2),
ADD COLUMN IF NOT EXISTS valor_mensalidade DECIMAL(10,2),
ADD COLUMN IF NOT EXISTS valor_unico DECIMAL(10,2);

-- Add comments for documentation
COMMENT ON COLUMN public.cadastros_clientes.valor_setup IS 'Valor do setup inicial (apenas para modelo mensal)';
COMMENT ON COLUMN public.cadastros_clientes.valor_mensalidade IS 'Valor da mensalidade recorrente (apenas para modelo mensal)';
COMMENT ON COLUMN public.cadastros_clientes.valor_unico IS 'Valor do projeto único (apenas para modelo único)';
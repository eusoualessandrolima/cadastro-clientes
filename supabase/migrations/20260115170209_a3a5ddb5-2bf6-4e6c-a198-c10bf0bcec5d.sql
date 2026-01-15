-- Drop the solucoes_existentes column as it's no longer needed
ALTER TABLE public.cadastros_clientes DROP COLUMN IF EXISTS solucoes_existentes;
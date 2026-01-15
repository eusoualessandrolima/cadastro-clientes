-- Permitir INSERT público na tabela cadastros_clientes
-- (mantendo SELECT/UPDATE/DELETE apenas para admins)

DROP POLICY IF EXISTS "Anyone can insert cadastros" ON cadastros_clientes;

CREATE POLICY "Anyone can insert cadastros" 
ON cadastros_clientes 
FOR INSERT 
WITH CHECK (true);
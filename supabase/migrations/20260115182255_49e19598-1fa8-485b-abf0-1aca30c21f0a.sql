-- Fix: Make the INSERT policy PERMISSIVE instead of RESTRICTIVE
DROP POLICY IF EXISTS "Anyone can insert cadastros" ON cadastros_clientes;

CREATE POLICY "Anyone can insert cadastros" 
ON cadastros_clientes 
FOR INSERT 
TO public
WITH CHECK (true);
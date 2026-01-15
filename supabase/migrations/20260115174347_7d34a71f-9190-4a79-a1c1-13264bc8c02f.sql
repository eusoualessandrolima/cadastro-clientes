-- 1. Criar enum de roles
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

-- 2. Criar tabela de user_roles (melhor prática - roles separados)
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL DEFAULT 'user',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE (user_id, role)
);

-- 3. Ativar RLS na tabela user_roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- 4. Criar função security definer para verificar roles (evita recursão)
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- 5. Políticas para user_roles (apenas admins podem gerenciar roles)
CREATE POLICY "Admins can view all roles"
ON public.user_roles
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin') OR user_id = auth.uid());

CREATE POLICY "Admins can insert roles"
ON public.user_roles
FOR INSERT
TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update roles"
ON public.user_roles
FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete roles"
ON public.user_roles
FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- 6. REMOVER políticas inseguras da tabela cadastros_clientes
DROP POLICY IF EXISTS "public_insert_cadastros" ON public.cadastros_clientes;
DROP POLICY IF EXISTS "authenticated_select_cadastros" ON public.cadastros_clientes;
DROP POLICY IF EXISTS "authenticated_update_cadastros" ON public.cadastros_clientes;
DROP POLICY IF EXISTS "authenticated_delete_cadastros" ON public.cadastros_clientes;

-- 7. CRIAR políticas seguras para cadastros_clientes

-- INSERT: Qualquer pessoa pode inserir (formulário público funciona)
CREATE POLICY "Anyone can insert cadastros"
ON public.cadastros_clientes
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- SELECT: Apenas admins podem ver todos os cadastros
CREATE POLICY "Admins can select all cadastros"
ON public.cadastros_clientes
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- UPDATE: Apenas admins podem atualizar
CREATE POLICY "Admins can update cadastros"
ON public.cadastros_clientes
FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- DELETE: Apenas admins podem deletar
CREATE POLICY "Admins can delete cadastros"
ON public.cadastros_clientes
FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));
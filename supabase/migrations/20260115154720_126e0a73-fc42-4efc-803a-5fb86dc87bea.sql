-- Create settings table for system configurations
CREATE TABLE IF NOT EXISTS public.configuracoes_sistema (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  configuracoes JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Enable RLS
ALTER TABLE public.configuracoes_sistema ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view their own settings
CREATE POLICY "Users can view their own settings"
ON public.configuracoes_sistema
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Policy: Users can insert their own settings
CREATE POLICY "Users can insert their own settings"
ON public.configuracoes_sistema
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Policy: Users can update their own settings
CREATE POLICY "Users can update their own settings"
ON public.configuracoes_sistema
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Policy: Users can delete their own settings
CREATE POLICY "Users can delete their own settings"
ON public.configuracoes_sistema
FOR DELETE
TO authenticated
USING (auth.uid() = user_id);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_configuracoes_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_configuracoes_sistema_updated_at
BEFORE UPDATE ON public.configuracoes_sistema
FOR EACH ROW
EXECUTE FUNCTION public.update_configuracoes_updated_at();
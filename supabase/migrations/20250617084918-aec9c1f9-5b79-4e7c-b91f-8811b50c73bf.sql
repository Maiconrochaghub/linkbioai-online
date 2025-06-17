
-- Adicionar campo role na tabela profiles
ALTER TABLE public.profiles ADD COLUMN role TEXT DEFAULT 'user';

-- Promover Maicon Rocha como administrador master
UPDATE public.profiles 
SET role = 'master_admin' 
WHERE id = '14e72f7f-759d-426a-9573-5ef6f5afaf35';

-- Criar função para verificar se é master admin
CREATE OR REPLACE FUNCTION public.is_master_admin(user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.profiles
    WHERE id = user_id
      AND role = 'master_admin'
  )
$$;

-- Atualizar políticas RLS para permitir acesso total ao master admin
-- Para a tabela profiles
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
CREATE POLICY "Users can view their own profile or master admin can view all"
  ON public.profiles 
  FOR SELECT 
  USING (
    auth.uid() = id OR 
    public.is_master_admin(auth.uid())
  );

DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
CREATE POLICY "Users can update their own profile or master admin can update all"
  ON public.profiles 
  FOR UPDATE 
  USING (
    auth.uid() = id OR 
    public.is_master_admin(auth.uid())
  );

-- Para a tabela links
DROP POLICY IF EXISTS "Users can view their own links" ON public.links;
CREATE POLICY "Users can view their own links or master admin can view all"
  ON public.links 
  FOR SELECT 
  USING (
    auth.uid() = user_id OR 
    public.is_master_admin(auth.uid())
  );

DROP POLICY IF EXISTS "Users can create their own links" ON public.links;
CREATE POLICY "Users can create their own links or master admin can create any"
  ON public.links 
  FOR INSERT 
  WITH CHECK (
    auth.uid() = user_id OR 
    public.is_master_admin(auth.uid())
  );

DROP POLICY IF EXISTS "Users can update their own links" ON public.links;
CREATE POLICY "Users can update their own links or master admin can update all"
  ON public.links 
  FOR UPDATE 
  USING (
    auth.uid() = user_id OR 
    public.is_master_admin(auth.uid())
  );

DROP POLICY IF EXISTS "Users can delete their own links" ON public.links;
CREATE POLICY "Users can delete their own links or master admin can delete all"
  ON public.links 
  FOR DELETE 
  USING (
    auth.uid() = user_id OR 
    public.is_master_admin(auth.uid())
  );

-- Para a tabela clicks
DROP POLICY IF EXISTS "Anyone can insert clicks" ON public.clicks;
CREATE POLICY "Anyone can insert clicks"
  ON public.clicks 
  FOR INSERT 
  WITH CHECK (true);

CREATE POLICY "Master admin can view all clicks"
  ON public.clicks 
  FOR SELECT 
  USING (public.is_master_admin(auth.uid()));


-- Adicionar campos de planos à tabela profiles
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS plan TEXT DEFAULT 'free',
ADD COLUMN IF NOT EXISTS plan_expires TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS stripe_customer_id TEXT,
ADD COLUMN IF NOT EXISTS subscription_id TEXT,
ADD COLUMN IF NOT EXISTS is_founder BOOLEAN DEFAULT false;

-- Criar função para contar quantos usuários fundadores temos
CREATE OR REPLACE FUNCTION public.get_founder_count()
RETURNS INTEGER
LANGUAGE sql
STABLE SECURITY DEFINER
AS $function$
  SELECT COUNT(*)::INTEGER
  FROM public.profiles
  WHERE is_founder = true AND plan = 'pro'
$function$;

-- Criar função para verificar se ainda pode ser fundador
CREATE OR REPLACE FUNCTION public.can_be_founder()
RETURNS BOOLEAN
LANGUAGE sql
STABLE SECURITY DEFINER
AS $function$
  SELECT (SELECT get_founder_count()) < 10000
$function$;

-- Remover policies existentes se existirem e criar novas
DROP POLICY IF EXISTS "Users can view their own plan info" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own plan info" ON public.profiles;

-- Criar policies para os campos de planos
CREATE POLICY "Users can view their own plan info" 
ON public.profiles 
FOR SELECT 
USING (auth.uid() = id);

CREATE POLICY "Users can update their own plan info" 
ON public.profiles 
FOR UPDATE 
USING (auth.uid() = id);

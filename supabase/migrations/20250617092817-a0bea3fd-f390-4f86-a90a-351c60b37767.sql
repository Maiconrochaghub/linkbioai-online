
-- Promover o novo usuário Maicon Rocha como administrador master
UPDATE public.profiles 
SET role = 'master_admin' 
WHERE id = 'bb2d39b1-7a98-4ea3-aff2-ee2523cb485b';

-- Adicionar campo bio se não existir
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS bio TEXT;

-- Adicionar campo avatar_url se não existir  
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS avatar_url TEXT;

-- Atualizar campo theme para ter valor padrão se não existir
ALTER TABLE public.profiles 
ALTER COLUMN theme SET DEFAULT 'default';

-- Criar bucket para avatars se não existir
INSERT INTO storage.buckets (id, name, public) 
VALUES ('avatars', 'avatars', true) 
ON CONFLICT (id) DO NOTHING;

-- Política para permitir upload de avatars
CREATE POLICY "Users can upload their own avatar" 
ON storage.objects 
FOR INSERT 
WITH CHECK (
  bucket_id = 'avatars' AND 
  (auth.uid()::text = (storage.foldername(name))[1] OR public.is_master_admin(auth.uid()))
);

-- Política para permitir visualização de avatars
CREATE POLICY "Anyone can view avatars" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'avatars');

-- Política para permitir atualização de avatars
CREATE POLICY "Users can update their own avatar" 
ON storage.objects 
FOR UPDATE 
USING (
  bucket_id = 'avatars' AND 
  (auth.uid()::text = (storage.foldername(name))[1] OR public.is_master_admin(auth.uid()))
);

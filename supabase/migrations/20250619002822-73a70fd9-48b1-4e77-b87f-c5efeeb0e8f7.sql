
-- Create social_links table for user social media links
CREATE TABLE public.social_links (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  platform TEXT NOT NULL CHECK (platform IN ('instagram', 'youtube', 'linkedin', 'twitter', 'github', 'whatsapp', 'email', 'website', 'tiktok', 'facebook')),
  url TEXT NOT NULL,
  position INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS on social_links
ALTER TABLE public.social_links ENABLE ROW LEVEL SECURITY;

-- Create policies for social_links
CREATE POLICY "Users can view own social links" ON public.social_links
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can insert own social links" ON public.social_links
  FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own social links" ON public.social_links
  FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "Users can delete own social links" ON public.social_links
  FOR DELETE USING (user_id = auth.uid());

-- Allow public access to view social links for public pages
CREATE POLICY "Allow public read access" ON public.social_links
  FOR SELECT USING (true);

-- Add customization fields to profiles table
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS button_color TEXT DEFAULT '#8B5CF6',
ADD COLUMN IF NOT EXISTS text_color TEXT DEFAULT '#1F2937',
ADD COLUMN IF NOT EXISTS is_admin BOOLEAN DEFAULT false;

-- Create trigger for updating updated_at on social_links
CREATE TRIGGER update_social_links_updated_at
  BEFORE UPDATE ON public.social_links
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create index for better performance
CREATE INDEX idx_social_links_user_id ON public.social_links(user_id);
CREATE INDEX idx_social_links_position ON public.social_links(user_id, position);

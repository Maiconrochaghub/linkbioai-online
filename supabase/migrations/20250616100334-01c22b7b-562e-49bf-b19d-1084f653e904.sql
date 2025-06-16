
-- Create users profile table (extends auth.users)
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  username VARCHAR(50) UNIQUE NOT NULL,
  avatar_url TEXT,
  bio TEXT,
  theme VARCHAR(20) DEFAULT 'instagram',
  is_verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create links table
CREATE TABLE public.links (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  title VARCHAR(100) NOT NULL,
  url TEXT NOT NULL,
  icon VARCHAR(50) DEFAULT 'website',
  position INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  click_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create clicks table for analytics
CREATE TABLE public.clicks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  link_id UUID REFERENCES public.links(id) ON DELETE CASCADE NOT NULL,
  ip_hash VARCHAR(64),
  user_agent TEXT,
  referer TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.links ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clicks ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view their own profile" 
  ON public.profiles FOR SELECT 
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" 
  ON public.profiles FOR UPDATE 
  USING (auth.uid() = id);

CREATE POLICY "Anyone can view public profiles" 
  ON public.profiles FOR SELECT 
  USING (true);

-- Links policies
CREATE POLICY "Users can view their own links" 
  ON public.links FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own links" 
  ON public.links FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own links" 
  ON public.links FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own links" 
  ON public.links FOR DELETE 
  USING (auth.uid() = user_id);

CREATE POLICY "Anyone can view active public links" 
  ON public.links FOR SELECT 
  USING (is_active = true);

-- Clicks policies (for analytics)
CREATE POLICY "Users can view clicks on their links" 
  ON public.clicks FOR SELECT 
  USING (EXISTS (
    SELECT 1 FROM public.links 
    WHERE links.id = clicks.link_id 
    AND links.user_id = auth.uid()
  ));

CREATE POLICY "Anyone can insert clicks" 
  ON public.clicks FOR INSERT 
  WITH CHECK (true);

-- Create indexes for performance
CREATE INDEX idx_profiles_username ON public.profiles(username);
CREATE INDEX idx_links_user_id ON public.links(user_id);
CREATE INDEX idx_links_position ON public.links(user_id, position);
CREATE INDEX idx_clicks_link_id ON public.clicks(link_id);
CREATE INDEX idx_clicks_created_at ON public.clicks(created_at);

-- Function to handle new user registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  generated_username TEXT;
  counter INTEGER := 0;
  base_username TEXT;
BEGIN
  -- Generate base username from email
  base_username := LOWER(REGEXP_REPLACE(
    SPLIT_PART(NEW.email, '@', 1), 
    '[^a-z0-9]', '', 'g'
  ));
  
  -- Ensure username is not empty and has reasonable length
  IF LENGTH(base_username) < 3 THEN
    base_username := 'user' || EXTRACT(EPOCH FROM NOW())::INTEGER;
  ELSIF LENGTH(base_username) > 15 THEN
    base_username := LEFT(base_username, 15);
  END IF;
  
  generated_username := base_username;
  
  -- Check for username uniqueness and add counter if needed
  WHILE EXISTS (SELECT 1 FROM public.profiles WHERE username = generated_username) LOOP
    counter := counter + 1;
    generated_username := base_username || counter::TEXT;
    
    -- Prevent infinite loop
    IF counter > 1000 THEN
      generated_username := 'user' || EXTRACT(EPOCH FROM NOW())::INTEGER || FLOOR(RANDOM() * 1000)::INTEGER;
      EXIT;
    END IF;
  END LOOP;
  
  -- Insert profile with generated username
  INSERT INTO public.profiles (id, name, username)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', SPLIT_PART(NEW.email, '@', 1)),
    generated_username
  );
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile on user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER update_profiles_updated_at 
  BEFORE UPDATE ON public.profiles 
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_links_updated_at 
  BEFORE UPDATE ON public.links 
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


CREATE OR REPLACE FUNCTION increment_click_count(link_id uuid)
RETURNS void
LANGUAGE sql
SECURITY DEFINER
AS $$
  UPDATE public.links 
  SET click_count = COALESCE(click_count, 0) + 1 
  WHERE id = link_id;
$$;

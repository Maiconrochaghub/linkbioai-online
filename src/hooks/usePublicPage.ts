
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface PublicProfile {
  id: string;
  name: string;
  username: string;
  avatar_url?: string;
  bio?: string;
}

interface PublicLink {
  id: string;
  title: string;
  url: string;
  icon: string;
  position: number;
  click_count: number;
}

interface PublicPageData {
  profile: PublicProfile;
  links: PublicLink[];
}

export function usePublicPage(username: string) {
  const [data, setData] = useState<PublicPageData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (username) {
      fetchPublicPage(username);
    }
  }, [username]);

  const fetchPublicPage = async (username: string) => {
    setLoading(true);
    setError(null);
    
    try {
      // Fetch profile
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('id, name, username, avatar_url, bio')
        .eq('username', username)
        .single();

      if (profileError) {
        console.error('Profile not found:', profileError);
        setError('Usuário não encontrado');
        return;
      }

      // Fetch active links
      const { data: links, error: linksError } = await supabase
        .from('links')
        .select('id, title, url, icon, position, click_count')
        .eq('user_id', profile.id)
        .eq('is_active', true)
        .order('position', { ascending: true });

      if (linksError) {
        console.error('Error fetching links:', linksError);
        setError('Erro ao carregar links');
        return;
      }

      setData({
        profile,
        links: links || []
      });
    } catch (error) {
      console.error('Error fetching public page:', error);
      setError('Erro inesperado');
    } finally {
      setLoading(false);
    }
  };

  const trackClick = async (linkId: string) => {
    try {
      // Insert click record for analytics
      await supabase.from('clicks').insert({
        link_id: linkId,
        ip_hash: null, // Could implement IP hashing for privacy
        user_agent: navigator.userAgent,
        referer: document.referrer || null
      });

      // Update click count on link
      await supabase.rpc('increment_click_count', { link_id: linkId });
      
      // Update local state
      if (data) {
        setData(prev => ({
          ...prev!,
          links: prev!.links.map(link => 
            link.id === linkId 
              ? { ...link, click_count: link.click_count + 1 }
              : link
          )
        }));
      }
    } catch (error) {
      console.error('Error tracking click:', error);
      // Don't show error to user, this is analytics tracking
    }
  };

  return {
    data,
    loading,
    error,
    trackClick
  };
}

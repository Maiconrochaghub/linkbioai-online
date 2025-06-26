
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface PublicProfile {
  id: string;
  name: string;
  username: string;
  avatar_url?: string;
  bio?: string;
  theme?: string;
  button_color?: string;
  text_color?: string;
  plan?: string;
  is_founder?: boolean;
  is_admin?: boolean;
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
      console.log('🔍 Fetching public page for:', username);
      
      // Fetch profile com timeout otimizado
      const profilePromise = supabase
        .from('profiles')
        .select('id, name, username, avatar_url, bio, theme, button_color, text_color, plan, is_founder, is_admin')
        .eq('username', username)
        .single();

      const { data: profile, error: profileError } = await profilePromise;

      if (profileError) {
        console.error('❌ Profile not found:', profileError);
        setError('Usuário não encontrado');
        return;
      }

      console.log('✅ Profile found:', profile.name);

      // Fetch links ativos apenas
      const { data: links, error: linksError } = await supabase
        .from('links')
        .select('id, title, url, icon, position, click_count')
        .eq('user_id', profile.id)
        .eq('is_active', true)
        .order('position', { ascending: true });

      if (linksError) {
        console.error('❌ Error fetching links:', linksError);
        setError('Erro ao carregar links');
        return;
      }

      console.log('✅ Links loaded:', links?.length || 0);

      setData({
        profile,
        links: links || []
      });
    } catch (error) {
      console.error('❌ Error fetching public page:', error);
      setError('Erro inesperado');
    } finally {
      setLoading(false);
    }
  };

  const trackClick = async (linkId: string) => {
    try {
      // Track click em background sem bloquear
      const trackPromise = supabase.from('clicks').insert({
        link_id: linkId,
        ip_hash: null,
        user_agent: navigator.userAgent,
        referer: document.referrer || null
      });

      // Update click count using direct SQL update instead of RPC for now
      const updatePromise = supabase
        .from('links')
        .update({ 
          click_count: data?.links.find(link => link.id === linkId)?.click_count || 0 + 1
        })
        .eq('id', linkId);

      // Executar em background sem aguardar
      Promise.all([trackPromise, updatePromise])
        .then(() => {
          console.log('✅ Click tracked successfully');
          // Atualizar estado local se possível
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
        })
        .catch(error => {
          console.error('❌ Error tracking click:', error);
        });
    } catch (error) {
      console.error('❌ Error tracking click:', error);
    }
  };

  return {
    data,
    loading,
    error,
    trackClick
  };
}

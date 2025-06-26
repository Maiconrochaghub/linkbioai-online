
import { useState, useEffect, useCallback } from 'react';
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

interface PublicSocialLink {
  id: string;
  platform: string;
  url: string;
  position: number;
}

interface PublicPageData {
  profile: PublicProfile;
  links: PublicLink[];
  socialLinks?: PublicSocialLink[];
}

export function usePublicPageOptimized(username: string) {
  const [data, setData] = useState<PublicPageData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  const MAX_RETRIES = 3;
  const TIMEOUT_MS = 8000;

  const withTimeout = <T>(promise: Promise<T>, timeoutMs: number): Promise<T> => {
    return Promise.race([
      promise,
      new Promise<T>((_, reject) =>
        setTimeout(() => reject(new Error('Timeout')), timeoutMs)
      ),
    ]);
  };

  const cleanUrl = (url: string): string => {
    try {
      // Remove query parameters that might cause issues
      const urlObj = new URL(url.startsWith('http') ? url : `https://${url}`);
      return urlObj.toString();
    } catch {
      return url.startsWith('http') ? url : `https://${url}`;
    }
  };

  const fetchPublicPageWithRetry = useCallback(async (username: string, attempt = 0): Promise<void> => {
    setLoading(true);
    setError(null);
    
    try {
      console.log(`🔄 Tentativa ${attempt + 1} de carregar página pública para: ${username}`);
      
      // Fetch profile with timeout
      const profilePromise = supabase
        .from('profiles')
        .select('id, name, username, avatar_url, bio, theme, button_color, text_color, plan, is_founder, is_admin')
        .eq('username', username)
        .single();

      const { data: profile, error: profileError } = await withTimeout(profilePromise, TIMEOUT_MS);

      if (profileError) {
        console.error('❌ Erro ao buscar perfil:', profileError);
        throw new Error('Usuário não encontrado');
      }

      console.log('✅ Perfil encontrado:', profile.name);

      // Fetch links with timeout
      const linksPromise = supabase
        .from('links')
        .select('id, title, url, icon, position, click_count')
        .eq('user_id', profile.id)
        .eq('is_active', true)
        .order('position', { ascending: true });

      const { data: rawLinks, error: linksError } = await withTimeout(linksPromise, TIMEOUT_MS);

      if (linksError) {
        console.error('❌ Erro ao buscar links:', linksError);
        throw new Error('Erro ao carregar links');
      }

      // Clean and validate URLs
      const links = (rawLinks || []).map(link => ({
        ...link,
        url: cleanUrl(link.url)
      }));

      console.log('✅ Links carregados:', links.length);

      // Fetch social links with timeout (non-critical)
      let socialLinks: PublicSocialLink[] = [];
      try {
        const socialPromise = supabase
          .from('social_links')
          .select('id, platform, url, position')
          .eq('user_id', profile.id)
          .order('position', { ascending: true });

        const { data: socialData } = await withTimeout(socialPromise, TIMEOUT_MS / 2);
        socialLinks = socialData || [];
        console.log('✅ Links sociais carregados:', socialLinks.length);
      } catch (socialError) {
        console.warn('⚠️ Falha ao carregar links sociais (não crítico):', socialError);
      }

      setData({
        profile,
        links,
        socialLinks
      });

      setRetryCount(0);
      console.log('🎉 Página pública carregada com sucesso!');
      
    } catch (error) {
      console.error(`❌ Erro na tentativa ${attempt + 1}:`, error);
      
      if (attempt < MAX_RETRIES - 1) {
        const delay = Math.min(1000 * Math.pow(2, attempt), 5000);
        console.log(`⏳ Tentando novamente em ${delay}ms...`);
        
        setTimeout(() => {
          setRetryCount(attempt + 1);
          fetchPublicPageWithRetry(username, attempt + 1);
        }, delay);
        return;
      }
      
      // Final error after all retries
      const errorMessage = error instanceof Error && error.message === 'Timeout' 
        ? 'Conexão lenta - tente novamente'
        : error instanceof Error 
          ? error.message 
          : 'Erro inesperado';
      
      setError(errorMessage);
      console.error('💥 Falha final após todas as tentativas');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (username) {
      // Add small delay for mobile optimization
      const timer = setTimeout(() => {
        fetchPublicPageWithRetry(username);
      }, 100);
      
      return () => clearTimeout(timer);
    }
  }, [username, fetchPublicPageWithRetry]);

  const trackClick = async (linkId: string) => {
    try {
      console.log('📊 Rastreando clique:', linkId);
      
      // Non-blocking analytics
      const trackingPromise = supabase.from('clicks').insert({
        link_id: linkId,
        ip_hash: null,
        user_agent: navigator.userAgent,
        referer: document.referrer || null
      });

      // Update click count
      const { data: linkData } = await supabase
        .from('links')
        .select('click_count')
        .eq('id', linkId)
        .single();

      if (linkData) {
        const newClickCount = (linkData.click_count || 0) + 1;
        
        await supabase
          .from('links')
          .update({ click_count: newClickCount })
          .eq('id', linkId);

        // Update local state
        if (data) {
          setData(prev => ({
            ...prev!,
            links: prev!.links.map(link => 
              link.id === linkId 
                ? { ...link, click_count: newClickCount }
                : link
            )
          }));
        }
      }

      // Don't await tracking to avoid blocking user
      trackingPromise.catch(error => 
        console.warn('⚠️ Falha no tracking (não crítico):', error)
      );

    } catch (error) {
      console.error('❌ Erro no tracking:', error);
      // Don't show error to user for analytics
    }
  };

  const retry = useCallback(() => {
    if (username) {
      fetchPublicPageWithRetry(username);
    }
  }, [username, fetchPublicPageWithRetry]);

  return {
    data,
    loading,
    error,
    retryCount,
    trackClick,
    retry
  };
}

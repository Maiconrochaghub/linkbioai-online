
import { useState, useEffect, useCallback } from 'react';
import { PublicPageData } from '@/types/publicPage';
import { fetchProfile, fetchLinks, fetchSocialLinks } from '@/utils/publicPageUtils';
import { trackLinkClick } from '@/utils/clickTracking';

export function usePublicPage(username: string) {
  const [data, setData] = useState<PublicPageData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  const MAX_RETRIES = 3;

  const fetchPublicPageWithRetry = useCallback(async (username: string, attempt = 0): Promise<void> => {
    setLoading(true);
    setError(null);
    
    try {
      console.log(`🔄 Tentativa ${attempt + 1} de carregar página pública para: ${username}`);
      
      const profile = await fetchProfile(username);
      console.log('✅ Perfil encontrado:', profile.name);

      const links = await fetchLinks(profile.id);
      console.log('✅ Links carregados:', links.length);

      const socialLinks = await fetchSocialLinks(profile.id);
      console.log('✅ Links sociais carregados:', socialLinks.length);

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
    const newClickCount = await trackLinkClick(linkId);

    // Update local state
    if (data && newClickCount > 0) {
      setData(prev => ({
        ...prev!,
        links: prev!.links.map(link => 
          link.id === linkId 
            ? { ...link, click_count: newClickCount }
            : link
        )
      }));
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

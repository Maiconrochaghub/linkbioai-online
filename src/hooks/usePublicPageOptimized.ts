
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

interface PublicPageData {
  profile: PublicProfile;
  links: PublicLink[];
}

// Cache em memória para perfis públicos (5 minutos)
const profileCache = new Map<string, { data: PublicPageData; timestamp: number }>();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutos

export function usePublicPageOptimized(username: string) {
  const [data, setData] = useState<PublicPageData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Verificar cache antes de fazer request
  const getCachedData = useCallback((username: string): PublicPageData | null => {
    const cached = profileCache.get(username);
    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
      console.log('✅ Using cached data for:', username);
      return cached.data;
    }
    if (cached) {
      profileCache.delete(username);
    }
    return null;
  }, []);

  // Salvar no cache
  const setCachedData = useCallback((username: string, data: PublicPageData) => {
    profileCache.set(username, { data, timestamp: Date.now() });
  }, []);

  useEffect(() => {
    if (!username) return;

    const fetchPublicPage = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // Verificar cache primeiro
        const cachedData = getCachedData(username);
        if (cachedData) {
          setData(cachedData);
          setLoading(false);
          return;
        }

        console.log('🔍 Fetching fresh data for:', username);
        
        // Fetch otimizado com Promise.all para paralelizar
        const [profileResult, linksResult] = await Promise.all([
          supabase
            .from('profiles')
            .select('id, name, username, avatar_url, bio, theme, button_color, text_color, plan, is_founder, is_admin')
            .eq('username', username)
            .single(),
          
          // Pre-fetch links enquanto profile é buscado
          supabase
            .from('profiles')
            .select('id')
            .eq('username', username)
            .single()
            .then(async (result) => {
              if (result.data) {
                return supabase
                  .from('links')
                  .select('id, title, url, icon, position, click_count')
                  .eq('user_id', result.data.id)
                  .eq('is_active', true)
                  .order('position', { ascending: true });
              }
              return { data: null, error: null };
            })
        ]);

        if (profileResult.error) {
          console.error('❌ Profile not found:', profileResult.error);
          setError('Usuário não encontrado');
          return;
        }

        const pageData = {
          profile: profileResult.data,
          links: linksResult.data || []
        };

        console.log('✅ Fresh data loaded:', pageData.profile.name, 'Links:', pageData.links.length);

        // Salvar no cache
        setCachedData(username, pageData);
        setData(pageData);
        
      } catch (error) {
        console.error('❌ Error fetching public page:', error);
        setError('Erro inesperado');
      } finally {
        setLoading(false);
      }
    };

    fetchPublicPage();
  }, [username, getCachedData, setCachedData]);

  // Tracking otimizado com correção matemática
  const trackClick = useCallback(async (linkId: string) => {
    if (!data) return;

    try {
      // Encontrar link atual e calcular novo count CORRETAMENTE
      const currentLink = data.links.find(link => link.id === linkId);
      const currentCount = currentLink?.click_count || 0;
      const newCount = currentCount + 1; // CORREÇÃO: estava somando 0 + 1 sempre
      
      console.log('📊 Tracking click:', linkId, 'Current:', currentCount, 'New:', newCount);

      // Atualizar estado local imediatamente para feedback visual
      setData(prev => ({
        ...prev!,
        links: prev!.links.map(link => 
          link.id === linkId 
            ? { ...link, click_count: newCount }
            : link
        )
      }));

      // Track click e update em background
      const promises = [
        // Insert click tracking
        supabase.from('clicks').insert({
          link_id: linkId,
          ip_hash: null,
          user_agent: navigator.userAgent,
          referer: document.referrer || null
        }),
        
        // Update click count com valor correto
        supabase
          .from('links')
          .update({ click_count: newCount })
          .eq('id', linkId)
      ];

      // Executar em background
      Promise.all(promises)
        .then(() => {
          console.log('✅ Click tracked successfully');
          // Invalidar cache para forçar refresh na próxima visita
          profileCache.delete(username);
        })
        .catch(error => {
          console.error('❌ Error tracking click:', error);
          // Reverter estado local em caso de erro
          setData(prev => ({
            ...prev!,
            links: prev!.links.map(link => 
              link.id === linkId 
                ? { ...link, click_count: currentCount }
                : link
            )
          }));
        });

    } catch (error) {
      console.error('❌ Error in trackClick:', error);
    }
  }, [data, username]);

  return {
    data,
    loading,
    error,
    trackClick
  };
}

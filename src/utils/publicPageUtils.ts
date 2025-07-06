
import { supabase } from '@/integrations/supabase/client';
import { PublicProfile, PublicLink, PublicSocialLink } from '@/types/publicPage';
import type { PostgrestResponse } from '@supabase/supabase-js';

const TIMEOUT_MS = 8000;

export const withTimeout = <T>(promise: Promise<T>, timeoutMs: number): Promise<T> => {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) =>
      setTimeout(() => reject(new Error('Timeout')), timeoutMs)
    ),
  ]);
};

export const cleanUrl = (url: string): string => {
  try {
    // Remove query parameters that might cause issues
    const urlObj = new URL(url.startsWith('http') ? url : `https://${url}`);
    return urlObj.toString();
  } catch {
    return url.startsWith('http') ? url : `https://${url}`;
  }
};

export const fetchProfile = async (username: string): Promise<PublicProfile> => {
  const profileQuery = supabase
    .from('profiles')
    .select('id, name, username, avatar_url, bio, theme, button_color, text_color, plan, is_founder, is_admin')
    .eq('username', username)
    .single();

  const profileResponse: PostgrestResponse<PublicProfile> = await withTimeout(
    profileQuery,
    TIMEOUT_MS
  );

  if (profileResponse.error) {
    console.error('❌ Erro ao buscar perfil:', profileResponse.error);
    throw new Error('Usuário não encontrado');
  }

  return profileResponse.data;
};

export const fetchLinks = async (userId: string): Promise<PublicLink[]> => {
  const linksQuery = supabase
    .from('links')
    .select('id, title, url, icon, position, click_count')
    .eq('user_id', userId)
    .eq('is_active', true)
    .order('position', { ascending: true });

  const linksResponse: PostgrestResponse<PublicLink[]> = await withTimeout(
    linksQuery,
    TIMEOUT_MS
  );

  if (linksResponse.error) {
    console.error('❌ Erro ao buscar links:', linksResponse.error);
    throw new Error('Erro ao carregar links');
  }

  // Clean and validate URLs
  return (linksResponse.data || []).map(link => ({
    ...link,
    url: cleanUrl(link.url)
  }));
};

export const fetchSocialLinks = async (userId: string): Promise<PublicSocialLink[]> => {
  try {
    const socialQuery = supabase
      .from('social_links')
      .select('id, platform, url, position')
      .eq('user_id', userId)
      .order('position', { ascending: true });

    const socialResponse: PostgrestResponse<PublicSocialLink[]> = await withTimeout(
      socialQuery,
      TIMEOUT_MS / 2
    );

    return socialResponse.data || [];
  } catch (socialError) {
    console.warn('⚠️ Falha ao carregar links sociais (não crítico):', socialError);
    return [];
  }
};

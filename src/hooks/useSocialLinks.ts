
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export interface SocialLink {
  id: string;
  platform: string;
  url: string;
  position: number;
}

export const useSocialLinks = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchSocialLinks();
    }
  }, [user]);

  const fetchSocialLinks = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('social_links')
        .select('*')
        .eq('user_id', user.id)
        .order('position', { ascending: true });

      if (error) throw error;
      setSocialLinks(data || []);
    } catch (error) {
      console.error('Error fetching social links:', error);
      toast({
        title: "Erro",
        description: "Erro ao carregar redes sociais",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const addSocialLink = async (platform: string, url: string) => {
    if (!user) return { error: 'Usuário não autenticado' };

    try {
      const position = socialLinks.length;
      const { data, error } = await supabase
        .from('social_links')
        .insert({
          user_id: user.id,
          platform,
          url,
          position
        })
        .select()
        .single();

      if (error) throw error;

      setSocialLinks(prev => [...prev, data]);
      toast({
        title: "Sucesso",
        description: "Rede social adicionada com sucesso!",
      });
      
      return { error: null };
    } catch (error) {
      console.error('Error adding social link:', error);
      return { error: 'Erro ao adicionar rede social' };
    }
  };

  const removeSocialLink = async (id: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('social_links')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;

      setSocialLinks(prev => prev.filter(link => link.id !== id));
      toast({
        title: "Sucesso",
        description: "Rede social removida com sucesso!",
      });
    } catch (error) {
      console.error('Error removing social link:', error);
      toast({
        title: "Erro",
        description: "Erro ao remover rede social",
        variant: "destructive",
      });
    }
  };

  return {
    socialLinks,
    loading,
    addSocialLink,
    removeSocialLink,
    refreshSocialLinks: fetchSocialLinks
  };
};

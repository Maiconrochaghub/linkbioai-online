
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface Link {
  id: string;
  user_id: string;
  title: string;
  url: string;
  icon: string;
  position: number;
  is_active: boolean;
  click_count: number;
  created_at: string;
  updated_at: string;
}

interface CreateLinkData {
  title: string;
  url: string;
  icon?: string;
}

export function useLinks() {
  const [links, setLinks] = useState<Link[]>([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      fetchLinks();
    }
  }, [user]);

  const fetchLinks = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('links')
        .select('*')
        .eq('user_id', user.id)
        .order('position', { ascending: true });

      if (error) {
        console.error('Error fetching links:', error);
        toast({
          title: "Erro",
          description: "Erro ao carregar links",
          variant: "destructive"
        });
        return;
      }

      setLinks(data || []);
    } finally {
      setLoading(false);
    }
  };

  const addLink = async (linkData: CreateLinkData) => {
    if (!user) return;

    // Detect icon from URL
    const icon = detectIcon(linkData.url);
    const position = links.length;

    try {
      const { data, error } = await supabase
        .from('links')
        .insert({
          user_id: user.id,
          title: linkData.title,
          url: linkData.url,
          icon: linkData.icon || icon,
          position,
          is_active: true
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating link:', error);
        toast({
          title: "Erro",
          description: "Erro ao criar link",
          variant: "destructive"
        });
        return;
      }

      setLinks(prev => [...prev, data]);
      toast({
        title: "Sucesso",
        description: "Link adicionado com sucesso!"
      });
    } catch (error) {
      console.error('Error creating link:', error);
      toast({
        title: "Erro",
        description: "Erro inesperado ao criar link",
        variant: "destructive"
      });
    }
  };

  const updateLink = async (id: string, updates: Partial<Link>) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('links')
        .update(updates)
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) {
        console.error('Error updating link:', error);
        toast({
          title: "Erro",
          description: "Erro ao atualizar link",
          variant: "destructive"
        });
        return;
      }

      setLinks(prev => prev.map(link => 
        link.id === id ? { ...link, ...updates, updated_at: new Date().toISOString() } : link
      ));

      toast({
        title: "Sucesso",
        description: "Link atualizado com sucesso!"
      });
    } catch (error) {
      console.error('Error updating link:', error);
      toast({
        title: "Erro",
        description: "Erro inesperado ao atualizar link",
        variant: "destructive"
      });
    }
  };

  const deleteLink = async (id: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('links')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) {
        console.error('Error deleting link:', error);
        toast({
          title: "Erro",
          description: "Erro ao excluir link",
          variant: "destructive"
        });
        return;
      }

      setLinks(prev => prev.filter(link => link.id !== id));
      toast({
        title: "Sucesso",
        description: "Link excluído com sucesso!"
      });
    } catch (error) {
      console.error('Error deleting link:', error);
      toast({
        title: "Erro",
        description: "Erro inesperado ao excluir link",
        variant: "destructive"
      });
    }
  };

  const reorderLinks = async (reorderedLinks: Link[]) => {
    if (!user) return;

    try {
      // Update positions in database
      const updates = reorderedLinks.map((link, index) => ({
        id: link.id,
        position: index
      }));

      for (const update of updates) {
        const { error } = await supabase
          .from('links')
          .update({ position: update.position })
          .eq('id', update.id)
          .eq('user_id', user.id);

        if (error) throw error;
      }

      // Update local state
      setLinks(reorderedLinks.map((link, index) => ({
        ...link,
        position: index
      })));

      toast({
        title: "Sucesso",
        description: "Ordem dos links atualizada!"
      });
    } catch (error) {
      console.error('Error reordering links:', error);
      toast({
        title: "Erro",
        description: "Erro ao reordenar links",
        variant: "destructive"
      });
    }
  };

  return {
    links,
    loading,
    addLink,
    updateLink,
    deleteLink,
    reorderLinks,
    refetch: fetchLinks
  };
}

// Icon detection utility
function detectIcon(url: string): string {
  if (!url) return 'website';
  
  try {
    const domain = new URL(url).hostname.toLowerCase();
    
    const iconMap: Record<string, string> = {
      'instagram.com': 'instagram',
      'www.instagram.com': 'instagram',
      'youtube.com': 'youtube',
      'www.youtube.com': 'youtube',
      'youtu.be': 'youtube',
      'tiktok.com': 'tiktok',
      'www.tiktok.com': 'tiktok',
      'twitter.com': 'twitter',
      'www.twitter.com': 'twitter',
      'x.com': 'twitter',
      'linkedin.com': 'linkedin',
      'www.linkedin.com': 'linkedin',
      'github.com': 'github',
      'www.github.com': 'github',
      'wa.me': 'whatsapp',
      'api.whatsapp.com': 'whatsapp'
    };
    
    return iconMap[domain] || 'website';
  } catch {
    return 'website';
  }
}

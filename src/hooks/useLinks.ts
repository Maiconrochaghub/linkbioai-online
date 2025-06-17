
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export interface Link {
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

export function useLinks() {
  const [links, setLinks] = useState<Link[]>([]);
  const [loading, setLoading] = useState(true);
  const { user, isMasterAdmin } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      fetchLinks();
    }
  }, [user]);

  const fetchLinks = async () => {
    if (!user) return;

    try {
      setLoading(true);
      
      // Master admin can see all links, regular users only their own
      let query = supabase
        .from('links')
        .select('*')
        .order('position', { ascending: true });

      // If not master admin, filter by user_id
      if (!isMasterAdmin()) {
        query = query.eq('user_id', user.id);
      }

      const { data, error } = await query;

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
    } catch (error) {
      console.error('Error fetching links:', error);
    } finally {
      setLoading(false);
    }
  };

  const addLink = async (linkData: { title: string; url: string }) => {
    if (!user) return;

    try {
      // Get the highest position
      const maxPosition = links.length > 0 ? Math.max(...links.map(l => l.position)) : -1;
      
      const { data, error } = await supabase
        .from('links')
        .insert([{
          user_id: user.id,
          title: linkData.title,
          url: linkData.url,
          position: maxPosition + 1,
          is_active: true,
          icon: 'website'
        }])
        .select()
        .single();

      if (error) {
        toast({
          title: "Erro",
          description: "Erro ao adicionar link",
          variant: "destructive"
        });
        return;
      }

      setLinks(prev => [...prev, data]);
      toast({
        title: "Sucesso",
        description: "Link adicionado com sucesso!",
      });
    } catch (error) {
      console.error('Error adding link:', error);
    }
  };

  const updateLink = async (id: string, updates: Partial<Link>) => {
    try {
      const { error } = await supabase
        .from('links')
        .update(updates)
        .eq('id', id);

      if (error) {
        toast({
          title: "Erro",
          description: "Erro ao atualizar link",
          variant: "destructive"
        });
        return;
      }

      setLinks(prev => prev.map(link => 
        link.id === id ? { ...link, ...updates } : link
      ));

      toast({
        title: "Sucesso",
        description: "Link atualizado com sucesso!",
      });
    } catch (error) {
      console.error('Error updating link:', error);
    }
  };

  const deleteLink = async (id: string) => {
    try {
      const { error } = await supabase
        .from('links')
        .delete()
        .eq('id', id);

      if (error) {
        toast({
          title: "Erro",
          description: "Erro ao deletar link",
          variant: "destructive"
        });
        return;
      }

      setLinks(prev => prev.filter(link => link.id !== id));
      toast({
        title: "Sucesso",
        description: "Link removido com sucesso!",
      });
    } catch (error) {
      console.error('Error deleting link:', error);
    }
  };

  const reorderLinks = async (reorderedLinks: Link[]) => {
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
          .eq('id', update.id);

        if (error) {
          console.error('Error updating link position:', error);
          return;
        }
      }

      setLinks(reorderedLinks);
      toast({
        title: "Sucesso",
        description: "Ordem dos links atualizada!",
      });
    } catch (error) {
      console.error('Error reordering links:', error);
    }
  };

  return {
    links,
    loading,
    addLink,
    updateLink,
    deleteLink,
    reorderLinks,
    fetchLinks
  };
}

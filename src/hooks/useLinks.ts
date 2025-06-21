
import { useState, useEffect, useCallback } from 'react';
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
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchLinks = useCallback(async () => {
    if (!user) {
      setLoading(false);
      setLinks([]);
      return;
    }

    try {
      setLoading(true);
      console.log('🔗 Fetching links for user:', user.id);
      
      const { data, error } = await supabase
        .from('links')
        .select('*')
        .eq('user_id', user.id)
        .order('position', { ascending: true });

      if (error) {
        console.error('❌ Error fetching links:', error);
        toast({
          title: "Erro",
          description: "Erro ao carregar links",
          variant: "destructive"
        });
        setLinks([]);
        return;
      }

      console.log('✅ Links loaded:', data?.length || 0);
      setLinks(data || []);
    } catch (error) {
      console.error('❌ Unexpected error fetching links:', error);
      setLinks([]);
    } finally {
      setLoading(false);
    }
  }, [user, toast]);

  useEffect(() => {
    fetchLinks();
  }, [fetchLinks]);

  const addLink = async (linkData: { title: string; url: string }) => {
    if (!user) {
      toast({
        title: "Erro",
        description: "Usuário não identificado",
        variant: "destructive"
      });
      return;
    }

    try {
      console.log('➕ Adding link:', linkData.title);
      
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
        console.error('❌ Error adding link:', error);
        toast({
          title: "Erro",
          description: "Erro ao adicionar link",
          variant: "destructive"
        });
        return;
      }

      console.log('✅ Link added:', data.title);
      setLinks(prev => [...prev, data]);
      toast({
        title: "Sucesso",
        description: "Link adicionado com sucesso!",
      });
    } catch (error) {
      console.error('❌ Unexpected error adding link:', error);
      toast({
        title: "Erro",
        description: "Erro inesperado ao adicionar link",
        variant: "destructive"
      });
    }
  };

  const updateLink = async (id: string, updates: Partial<Link>) => {
    try {
      console.log('✏️ Updating link:', id);
      
      const { error } = await supabase
        .from('links')
        .update(updates)
        .eq('id', id);

      if (error) {
        console.error('❌ Error updating link:', error);
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

      console.log('✅ Link updated successfully');
      toast({
        title: "Sucesso",
        description: "Link atualizado com sucesso!",
      });
    } catch (error) {
      console.error('❌ Unexpected error updating link:', error);
    }
  };

  const deleteLink = async (id: string) => {
    try {
      console.log('🗑️ Deleting link:', id);
      
      const { error } = await supabase
        .from('links')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('❌ Error deleting link:', error);
        toast({
          title: "Erro",
          description: "Erro ao deletar link",
          variant: "destructive"
        });
        return;
      }

      setLinks(prev => prev.filter(link => link.id !== id));
      console.log('✅ Link deleted successfully');
      toast({
        title: "Sucesso",
        description: "Link removido com sucesso!",
      });
    } catch (error) {
      console.error('❌ Unexpected error deleting link:', error);
    }
  };

  const reorderLinks = async (reorderedLinks: Link[]) => {
    try {
      console.log('🔄 Reordering links...');
      
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
          console.error('❌ Error updating link position:', error);
          return;
        }
      }

      setLinks(reorderedLinks);
      console.log('✅ Links reordered successfully');
      toast({
        title: "Sucesso",
        description: "Ordem dos links atualizada!",
      });
    } catch (error) {
      console.error('❌ Unexpected error reordering links:', error);
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

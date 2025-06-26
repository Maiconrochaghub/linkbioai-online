
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
  const [saving, setSaving] = useState(false);
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
      toast({
        title: "Erro",
        description: "Erro inesperado ao carregar links",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  }, [user, toast]);

  useEffect(() => {
    fetchLinks();
  }, [fetchLinks]);

  const addLink = async (linkData: { title: string; url: string; icon?: string }) => {
    if (!user) {
      toast({
        title: "Erro",
        description: "Usuário não identificado",
        variant: "destructive"
      });
      return false;
    }

    try {
      setSaving(true);
      console.log('➕ Adding link:', linkData.title);
      
      // Validate URL
      let cleanUrl = linkData.url.trim();
      if (!cleanUrl) {
        toast({
          title: "Erro",
          description: "URL é obrigatória",
          variant: "destructive"
        });
        return false;
      }

      // Add protocol if missing
      if (!cleanUrl.startsWith('http://') && !cleanUrl.startsWith('https://')) {
        cleanUrl = 'https://' + cleanUrl;
      }

      // Validate title
      const cleanTitle = linkData.title.trim();
      if (!cleanTitle) {
        toast({
          title: "Erro",
          description: "Título é obrigatório",
          variant: "destructive"
        });
        return false;
      }
      
      const maxPosition = links.length > 0 ? Math.max(...links.map(l => l.position)) : -1;
      
      const newLink = {
        user_id: user.id,
        title: cleanTitle,
        url: cleanUrl,
        position: maxPosition + 1,
        is_active: true,
        icon: linkData.icon || 'website'
      };

      const { data, error } = await supabase
        .from('links')
        .insert([newLink])
        .select()
        .single();

      if (error) {
        console.error('❌ Error adding link:', error);
        toast({
          title: "Erro",
          description: "Erro ao adicionar link: " + error.message,
          variant: "destructive"
        });
        return false;
      }

      console.log('✅ Link added:', data.title);
      setLinks(prev => [...prev, data]);
      toast({
        title: "Sucesso! 🎉",
        description: "Link adicionado com sucesso!",
        duration: 3000,
      });
      return true;
    } catch (error) {
      console.error('❌ Unexpected error adding link:', error);
      toast({
        title: "Erro Inesperado",
        description: "Erro inesperado ao adicionar link",
        variant: "destructive"
      });
      return false;
    } finally {
      setSaving(false);
    }
  };

  const updateLink = async (id: string, updates: Partial<Link>) => {
    try {
      setSaving(true);
      console.log('✏️ Updating link:', id, updates);
      
      // Clean URL if provided
      if (updates.url) {
        let cleanUrl = updates.url.trim();
        if (cleanUrl && !cleanUrl.startsWith('http://') && !cleanUrl.startsWith('https://')) {
          cleanUrl = 'https://' + cleanUrl;
        }
        updates.url = cleanUrl;
      }

      // Clean title if provided
      if (updates.title) {
        updates.title = updates.title.trim();
        if (!updates.title) {
          toast({
            title: "Erro",
            description: "Título não pode estar vazio",
            variant: "destructive"
          });
          return false;
        }
      }
      
      const { error } = await supabase
        .from('links')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', id);

      if (error) {
        console.error('❌ Error updating link:', error);
        toast({
          title: "Erro",
          description: "Erro ao atualizar link: " + error.message,
          variant: "destructive"
        });
        return false;
      }

      setLinks(prev => prev.map(link => 
        link.id === id ? { ...link, ...updates } : link
      ));

      console.log('✅ Link updated successfully');
      toast({
        title: "Sucesso",
        description: "Link atualizado com sucesso!",
      });
      return true;
    } catch (error) {
      console.error('❌ Unexpected error updating link:', error);
      toast({
        title: "Erro Inesperado",
        description: "Erro inesperado ao atualizar link",
        variant: "destructive"
      });
      return false;
    } finally {
      setSaving(false);
    }
  };

  const deleteLink = async (id: string) => {
    try {
      setSaving(true);
      console.log('🗑️ Deleting link:', id);
      
      const { error } = await supabase
        .from('links')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('❌ Error deleting link:', error);
        toast({
          title: "Erro",
          description: "Erro ao deletar link: " + error.message,
          variant: "destructive"
        });
        return false;
      }

      setLinks(prev => prev.filter(link => link.id !== id));
      console.log('✅ Link deleted successfully');
      toast({
        title: "Sucesso",
        description: "Link removido com sucesso!",
      });
      return true;
    } catch (error) {
      console.error('❌ Unexpected error deleting link:', error);
      toast({
        title: "Erro Inesperado",
        description: "Erro inesperado ao deletar link",
        variant: "destructive"
      });
      return false;
    } finally {
      setSaving(false);
    }
  };

  const reorderLinks = async (reorderedLinks: Link[]) => {
    try {
      setSaving(true);
      console.log('🔄 Reordering links...');
      
      // Update local state immediately for better UX
      setLinks(reorderedLinks);
      
      const updates = reorderedLinks.map((link, index) => ({
        id: link.id,
        position: index
      }));

      // Use Promise.all for better performance
      const updatePromises = updates.map(update => 
        supabase
          .from('links')
          .update({ 
            position: update.position,
            updated_at: new Date().toISOString()
          })
          .eq('id', update.id)
      );

      const results = await Promise.allSettled(updatePromises);
      
      // Check for any failures
      const failures = results.filter(result => result.status === 'rejected');
      if (failures.length > 0) {
        console.error('❌ Some position updates failed:', failures);
        // Refresh links to get correct order
        await fetchLinks();
        toast({
          title: "Aviso",
          description: "Algumas posições podem não ter sido salvas corretamente",
          variant: "destructive"
        });
        return false;
      }

      console.log('✅ Links reordered successfully');
      toast({
        title: "Sucesso",
        description: "Ordem dos links atualizada!",
      });
      return true;
    } catch (error) {
      console.error('❌ Unexpected error reordering links:', error);
      // Refresh links to get correct order
      await fetchLinks();
      toast({
        title: "Erro Inesperado",
        description: "Erro ao reordenar links",
        variant: "destructive"
      });
      return false;
    } finally {
      setSaving(false);
    }
  };

  return {
    links,
    loading,
    saving,
    addLink,
    updateLink,
    deleteLink,
    reorderLinks,
    fetchLinks
  };
}

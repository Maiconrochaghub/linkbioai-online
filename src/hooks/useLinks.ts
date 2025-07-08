import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Link, CreateLinkData } from '@/types/link';
import { 
  fetchUserLinks, 
  createLink, 
  updateLink as updateLinkService, 
  deleteLink as deleteLinkService,
  updateLinksPositions 
} from '@/services/linkService';

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
      const { data, error } = await fetchUserLinks(user.id);

      if (error) {
        toast({
          title: "Erro",
          description: "Erro ao carregar links",
          variant: "destructive"
        });
        setLinks([]);
        return;
      }

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

  const addLink = async (linkData: CreateLinkData) => {
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
      const maxPosition = links.length > 0 ? Math.max(...links.map(l => l.position)) : -1;
      const { data, error } = await createLink(linkData, user.id, maxPosition);

      if (error) {
        toast({
          title: "Erro",
          description: "Erro ao adicionar link: " + error.message,
          variant: "destructive"
        });
        return false;
      }

      if (data) {
        setLinks(prev => [...prev, data]);
        toast({
          title: "Sucesso! 🎉",
          description: "Link adicionado com sucesso!",
          duration: 3000,
        });
      }
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
      const { success, error } = await updateLinkService(id, updates);

      if (!success) {
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
      const { success, error } = await deleteLinkService(id);

      if (!success) {
        toast({
          title: "Erro",
          description: "Erro ao deletar link: " + error.message,
          variant: "destructive"
        });
        return false;
      }

      setLinks(prev => prev.filter(link => link.id !== id));
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
      
      // Update local state immediately for better UX
      setLinks(reorderedLinks);
      
      const updates = reorderedLinks.map((link, index) => ({
        id: link.id,
        position: index
      }));

      const { success, error } = await updateLinksPositions(updates);

      if (!success) {
        // Refresh links to get correct order
        await fetchLinks();
        toast({
          title: "Aviso",
          description: error.message,
          variant: "destructive"
        });
        return false;
      }

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

// Re-export types for backward compatibility
export type { Link, CreateLinkData } from '@/types/link';
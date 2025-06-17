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
  const { user, isMasterAdmin, isMaiconRocha } = useAuth();
  const { toast } = useToast();

  // Bypass para Maicon em desenvolvimento ou IDs de administradores master
  const isMaiconBypass = isMaiconRocha() && process.env.NODE_ENV === 'development';
  const MAICON_IDS = [
    '14e72f7f-759d-426a-9573-5ef6f5afaf35', // ID antigo
    'bb2d39b1-7a98-4ea3-aff2-ee2523cb485b'  // ID novo
  ];
  
  const effectiveUserId = user?.id || (isMaiconBypass ? MAICON_IDS[0] : null);

  useEffect(() => {
    if (effectiveUserId || isMaiconBypass) {
      fetchLinks();
    } else {
      setLoading(false);
    }
  }, [effectiveUserId, isMaiconBypass]);

  const fetchLinks = async () => {
    try {
      setLoading(true);
      console.log('🔗 Buscando links para usuário:', effectiveUserId || 'Maicon (bypass)');
      
      // Master admin pode ver todos os links, usuários comuns apenas os seus
      let query = supabase
        .from('links')
        .select('*')
        .order('position', { ascending: true });

      // Se não for master admin e tiver user ID, filtrar por user_id
      if (!isMasterAdmin() && !isMaiconBypass && effectiveUserId) {
        query = query.eq('user_id', effectiveUserId);
      }

      const { data, error } = await query;

      if (error) {
        console.error('❌ Erro ao buscar links:', error);
        toast({
          title: "Erro",
          description: "Erro ao carregar links",
          variant: "destructive"
        });
        setLinks([]);
        return;
      }

      console.log('✅ Links carregados:', data?.length || 0);
      setLinks(data || []);
    } catch (error) {
      console.error('❌ Erro inesperado ao buscar links:', error);
      setLinks([]);
    } finally {
      setLoading(false);
    }
  };

  const addLink = async (linkData: { title: string; url: string }) => {
    if (!effectiveUserId && !isMaiconBypass) {
      toast({
        title: "Erro",
        description: "Usuário não identificado",
        variant: "destructive"
      });
      return;
    }

    try {
      console.log('➕ Adicionando link:', linkData.title);
      
      // Get the highest position
      const maxPosition = links.length > 0 ? Math.max(...links.map(l => l.position)) : -1;
      
      const { data, error } = await supabase
        .from('links')
        .insert([{
          user_id: effectiveUserId || MAICON_IDS[0],
          title: linkData.title,
          url: linkData.url,
          position: maxPosition + 1,
          is_active: true,
          icon: 'website'
        }])
        .select()
        .single();

      if (error) {
        console.error('❌ Erro ao adicionar link:', error);
        toast({
          title: "Erro",
          description: "Erro ao adicionar link",
          variant: "destructive"
        });
        return;
      }

      console.log('✅ Link adicionado:', data.title);
      setLinks(prev => [...prev, data]);
      toast({
        title: "Sucesso",
        description: "Link adicionado com sucesso!",
      });
    } catch (error) {
      console.error('❌ Erro inesperado ao adicionar link:', error);
      toast({
        title: "Erro",
        description: "Erro inesperado ao adicionar link",
        variant: "destructive"
      });
    }
  };

  const updateLink = async (id: string, updates: Partial<Link>) => {
    try {
      console.log('✏️ Atualizando link:', id);
      
      const { error } = await supabase
        .from('links')
        .update(updates)
        .eq('id', id);

      if (error) {
        console.error('❌ Erro ao atualizar link:', error);
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

      console.log('✅ Link atualizado com sucesso');
      toast({
        title: "Sucesso",
        description: "Link atualizado com sucesso!",
      });
    } catch (error) {
      console.error('❌ Erro inesperado ao atualizar link:', error);
    }
  };

  const deleteLink = async (id: string) => {
    try {
      console.log('🗑️ Deletando link:', id);
      
      const { error } = await supabase
        .from('links')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('❌ Erro ao deletar link:', error);
        toast({
          title: "Erro",
          description: "Erro ao deletar link",
          variant: "destructive"
        });
        return;
      }

      setLinks(prev => prev.filter(link => link.id !== id));
      console.log('✅ Link deletado com sucesso');
      toast({
        title: "Sucesso",
        description: "Link removido com sucesso!",
      });
    } catch (error) {
      console.error('❌ Erro inesperado ao deletar link:', error);
    }
  };

  const reorderLinks = async (reorderedLinks: Link[]) => {
    try {
      console.log('🔄 Reordenando links...');
      
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
          console.error('❌ Erro ao atualizar posição do link:', error);
          return;
        }
      }

      setLinks(reorderedLinks);
      console.log('✅ Links reordenados com sucesso');
      toast({
        title: "Sucesso",
        description: "Ordem dos links atualizada!",
      });
    } catch (error) {
      console.error('❌ Erro inesperado ao reordenar links:', error);
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

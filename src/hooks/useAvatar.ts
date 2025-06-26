
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export function useAvatar() {
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();

  const uploadAvatar = async (file: File, userId: string): Promise<{ url?: string; error?: string }> => {
    try {
      setUploading(true);
      
      console.log('📸 Iniciando upload do avatar para usuário:', userId);
      
      // Validate file
      if (!file.type.startsWith('image/')) {
        const error = 'Arquivo deve ser uma imagem (JPG, PNG, GIF)';
        toast({
          title: "Tipo de arquivo inválido",
          description: error,
          variant: "destructive"
        });
        return { error };
      }
      
      if (file.size > 2 * 1024 * 1024) { // 2MB
        const error = 'Arquivo deve ter no máximo 2MB';
        toast({
          title: "Arquivo muito grande",
          description: error,
          variant: "destructive"
        });
        return { error };
      }

      // Generate unique filename with timestamp to avoid cache issues
      const fileExt = file.name.split('.').pop()?.toLowerCase() || 'jpg';
      const timestamp = Date.now();
      const fileName = `avatar_${timestamp}.${fileExt}`;
      const filePath = `${userId}/${fileName}`;

      console.log('📸 Fazendo upload para:', filePath);

      // Delete old avatar if exists
      try {
        const { data: existingFiles } = await supabase.storage
          .from('avatars')
          .list(userId);
        
        if (existingFiles && existingFiles.length > 0) {
          const oldFiles = existingFiles.map(f => `${userId}/${f.name}`);
          await supabase.storage
            .from('avatars')
            .remove(oldFiles);
          console.log('🗑️ Avatars antigos removidos');
        }
      } catch (cleanupError) {
        console.warn('⚠️ Erro ao limpar avatars antigos:', cleanupError);
      }

      // Upload new file
      const { error: uploadError, data } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, { 
          cacheControl: '3600',
          upsert: true,
          contentType: file.type
        });

      if (uploadError) {
        console.error('❌ Erro no upload:', uploadError);
        toast({
          title: "Erro no upload",
          description: uploadError.message || 'Falha ao enviar imagem',
          variant: "destructive"
        });
        return { error: uploadError.message };
      }

      // Get public URL
      const { data: urlData } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      if (!urlData?.publicUrl) {
        const error = 'Erro ao gerar URL da imagem';
        console.error('❌ Erro ao gerar URL pública');
        toast({
          title: "Erro",
          description: error,
          variant: "destructive"
        });
        return { error };
      }

      console.log('✅ Avatar enviado com sucesso:', urlData.publicUrl);
      
      toast({
        title: "Sucesso! 🎉",
        description: "Foto de perfil atualizada com sucesso!",
      });

      return { url: urlData.publicUrl };
    } catch (error: any) {
      console.error('❌ Erro inesperado no upload:', error);
      const errorMessage = error?.message || 'Erro inesperado ao enviar imagem';
      toast({
        title: "Erro inesperado",
        description: errorMessage,
        variant: "destructive"
      });
      return { error: errorMessage };
    } finally {
      setUploading(false);
    }
  };

  return {
    uploadAvatar,
    uploading
  };
}

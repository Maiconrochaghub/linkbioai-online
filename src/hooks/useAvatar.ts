
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export function useAvatar() {
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();

  const uploadAvatar = async (file: File, userId: string): Promise<{ url?: string; error?: string }> => {
    try {
      setUploading(true);
      
      // Validate file
      if (!file.type.startsWith('image/')) {
        return { error: 'Arquivo deve ser uma imagem' };
      }
      
      if (file.size > 1024 * 1024) { // 1MB
        return { error: 'Arquivo deve ter no máximo 1MB' };
      }

      // Generate unique filename
      const fileExt = file.name.split('.').pop();
      const fileName = `${userId}.${fileExt}`;
      const filePath = `${userId}/${fileName}`;

      console.log('📸 Fazendo upload do avatar:', filePath);

      // Upload file
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, { 
          upsert: true,
          contentType: file.type
        });

      if (uploadError) {
        console.error('❌ Erro no upload:', uploadError);
        return { error: uploadError.message };
      }

      // Get public URL
      const { data } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      console.log('✅ Avatar enviado com sucesso:', data.publicUrl);
      
      toast({
        title: "Sucesso",
        description: "Avatar atualizado com sucesso!",
      });

      return { url: data.publicUrl };
    } catch (error) {
      console.error('❌ Erro inesperado no upload:', error);
      return { error: 'Erro inesperado ao enviar imagem' };
    } finally {
      setUploading(false);
    }
  };

  return {
    uploadAvatar,
    uploading
  };
}

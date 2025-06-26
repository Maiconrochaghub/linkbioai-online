
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export function useAvatar() {
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();

  const uploadAvatar = async (file: File, userId: string): Promise<{ url?: string; error?: string }> => {
    try {
      setUploading(true);
      
      console.log('📸 Starting avatar upload for user:', userId);
      
      // Validate file
      if (!file.type.startsWith('image/')) {
        const error = 'Arquivo deve ser uma imagem';
        toast({
          title: "Erro",
          description: error,
          variant: "destructive"
        });
        return { error };
      }
      
      const maxSize = 2 * 1024 * 1024; // 2MB
      if (file.size > maxSize) {
        const error = 'Arquivo deve ter no máximo 2MB';
        toast({
          title: "Erro",
          description: error,
          variant: "destructive"
        });
        return { error };
      }

      // Compress image if needed
      const compressedFile = await compressImage(file);
      
      // Generate unique filename
      const fileExt = compressedFile.name.split('.').pop() || 'jpg';
      const fileName = `avatar-${Date.now()}.${fileExt}`;
      const filePath = `${userId}/${fileName}`;

      console.log('📸 Uploading to path:', filePath);

      // Upload file to storage
      const { error: uploadError, data: uploadData } = await supabase.storage
        .from('avatars')
        .upload(filePath, compressedFile, { 
          upsert: true,
          contentType: compressedFile.type,
          cacheControl: '3600'
        });

      if (uploadError) {
        console.error('❌ Upload error:', uploadError);
        const errorMessage = uploadError.message || 'Erro ao fazer upload da imagem';
        toast({
          title: "Erro no Upload",
          description: errorMessage,
          variant: "destructive"
        });
        return { error: errorMessage };
      }

      console.log('✅ Upload successful:', uploadData);

      // Get public URL
      const { data: urlData } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      if (!urlData?.publicUrl) {
        const error = 'Erro ao obter URL da imagem';
        toast({
          title: "Erro",
          description: error,
          variant: "destructive"
        });
        return { error };
      }

      console.log('✅ Public URL generated:', urlData.publicUrl);
      
      // Update user profile with new avatar URL
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ 
          avatar_url: urlData.publicUrl,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId);

      if (updateError) {
        console.error('❌ Profile update error:', updateError);
        toast({
          title: "Erro",
          description: "Erro ao atualizar perfil com nova imagem",
          variant: "destructive"
        });
        return { error: updateError.message };
      }

      toast({
        title: "Sucesso! 🎉",
        description: "Avatar atualizado com sucesso!",
        duration: 3000,
      });

      return { url: urlData.publicUrl };
    } catch (error) {
      console.error('❌ Unexpected error in upload:', error);
      const errorMessage = error instanceof Error ? error.message : 'Erro inesperado ao enviar imagem';
      toast({
        title: "Erro Inesperado",
        description: errorMessage,
        variant: "destructive"
      });
      return { error: errorMessage };
    } finally {
      setUploading(false);
    }
  };

  const deleteAvatar = async (userId: string, avatarUrl?: string): Promise<{ success: boolean; error?: string }> => {
    try {
      setUploading(true);
      
      console.log('🗑️ Deleting avatar for user:', userId);

      // Update profile to remove avatar URL
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ 
          avatar_url: null,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId);

      if (updateError) {
        console.error('❌ Profile update error:', updateError);
        toast({
          title: "Erro",
          description: "Erro ao remover avatar do perfil",
          variant: "destructive"
        });
        return { success: false, error: updateError.message };
      }

      // Try to delete from storage if URL is provided
      if (avatarUrl) {
        try {
          const urlParts = avatarUrl.split('/');
          const fileName = urlParts[urlParts.length - 1];
          const filePath = `${userId}/${fileName}`;
          
          const { error: deleteError } = await supabase.storage
            .from('avatars')
            .remove([filePath]);

          if (deleteError) {
            console.warn('⚠️ Storage deletion warning:', deleteError);
            // Don't fail the operation if storage deletion fails
          }
        } catch (storageError) {
          console.warn('⚠️ Storage deletion failed:', storageError);
          // Don't fail the operation if storage deletion fails
        }
      }

      toast({
        title: "Sucesso",
        description: "Avatar removido com sucesso!",
      });

      return { success: true };
    } catch (error) {
      console.error('❌ Unexpected error in delete:', error);
      const errorMessage = error instanceof Error ? error.message : 'Erro inesperado ao remover avatar';
      toast({
        title: "Erro Inesperado",
        description: errorMessage,
        variant: "destructive"
      });
      return { success: false, error: errorMessage };
    } finally {
      setUploading(false);
    }
  };

  return {
    uploadAvatar,
    deleteAvatar,
    uploading
  };
}

// Helper function to compress images
async function compressImage(file: File): Promise<File> {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    
    img.onload = () => {
      // Calculate new dimensions (max 800x800)
      const maxSize = 800;
      let { width, height } = img;
      
      if (width > height) {
        if (width > maxSize) {
          height = (height * maxSize) / width;
          width = maxSize;
        }
      } else {
        if (height > maxSize) {
          width = (width * maxSize) / height;
          height = maxSize;
        }
      }
      
      canvas.width = width;
      canvas.height = height;
      
      // Draw and compress
      ctx?.drawImage(img, 0, 0, width, height);
      
      canvas.toBlob(
        (blob) => {
          if (blob) {
            const compressedFile = new File([blob], file.name, {
              type: 'image/jpeg',
              lastModified: Date.now(),
            });
            resolve(compressedFile);
          } else {
            resolve(file);
          }
        },
        'image/jpeg',
        0.8 // 80% quality
      );
    };
    
    img.onerror = () => resolve(file);
    img.src = URL.createObjectURL(file);
  });
}

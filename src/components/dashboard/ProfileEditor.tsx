
import { useState, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Label } from "@/components/ui/label";
import { Camera, Loader2, Save, Trash2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useAvatar } from "@/hooks/useAvatar";
import { ThemeSelector } from "./ThemeSelector";
import { SocialLinksEditor } from "./SocialLinksEditor";
import { ColorCustomizer } from "./ColorCustomizer";
import { useToast } from "@/hooks/use-toast";

export function ProfileEditor() {
  const { user, profile, updateProfile } = useAuth();
  const { uploadAvatar, uploading } = useAvatar();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [formData, setFormData] = useState({
    name: profile?.name || '',
    bio: profile?.bio || '',
    theme: profile?.theme || 'default'
  });
  const [saving, setSaving] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !user) return;

    console.log('📸 Iniciando upload de avatar:', file.name);

    const { url, error } = await uploadAvatar(file, user.id);
    
    if (error) {
      console.error('❌ Erro no upload do avatar:', error);
      return;
    }

    if (url) {
      console.log('✅ Avatar URL obtida, atualizando perfil:', url);
      const { error: updateError } = await updateProfile({ avatar_url: url });
      
      if (updateError) {
        console.error('❌ Erro ao atualizar perfil com nova URL:', updateError);
        toast({
          title: "Erro ao atualizar perfil",
          description: "Foto enviada, mas erro ao salvar no perfil.",
          variant: "destructive"
        });
      }
    }

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleRemoveAvatar = async () => {
    if (!user) return;
    
    setSaving(true);
    
    try {
      const { error } = await updateProfile({ avatar_url: null });
      
      if (error) {
        toast({
          title: "Erro",
          description: "Erro ao remover foto de perfil.",
          variant: "destructive"
        });
      } else {
        toast({
          title: "Sucesso",
          description: "Foto de perfil removida.",
        });
      }
    } catch (error) {
      console.error('❌ Erro ao remover avatar:', error);
      toast({
        title: "Erro",
        description: "Erro inesperado ao remover foto.",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  const handleSave = async () => {
    if (!user) return;
    
    setSaving(true);
    
    try {
      console.log('💾 Salvando dados do perfil:', formData);
      
      const { error } = await updateProfile({
        name: formData.name,
        bio: formData.bio,
        theme: formData.theme
      });
      
      if (error) {
        console.error('❌ Erro ao salvar perfil:', error);
        toast({
          title: "Erro ao salvar",
          description: error || "Erro inesperado ao salvar perfil.",
          variant: "destructive"
        });
      } else {
        console.log('✅ Perfil salvo com sucesso');
        toast({
          title: "Perfil atualizado! 🎉",
          description: "Suas informações foram salvas com sucesso.",
        });
      }
    } catch (error: any) {
      console.error('❌ Erro inesperado ao salvar:', error);
      toast({
        title: "Erro inesperado",
        description: error?.message || "Tente novamente em alguns instantes.",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  if (!profile) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <Loader2 className="w-6 h-6 animate-spin" />
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Avatar e Info Básica */}
      <Card>
        <CardHeader>
          <CardTitle>Informações Pessoais</CardTitle>
          <CardDescription>
            Personalize seu perfil público
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Avatar */}
          <div className="flex items-center space-x-6">
            <div className="relative">
              <Avatar className="w-24 h-24 border-4 border-white shadow-lg">
                <AvatarImage 
                  src={profile.avatar_url} 
                  alt={profile.name}
                  className="object-cover"
                />
                <AvatarFallback className="bg-purple-100 text-purple-600 text-2xl font-bold">
                  {profile.name.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              
              <div className="absolute -bottom-2 -right-2 flex space-x-1">
                <Button
                  size="sm"
                  variant="secondary"
                  className="rounded-full w-8 h-8 p-0"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                  title="Alterar foto"
                >
                  {uploading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Camera className="w-4 h-4" />
                  )}
                </Button>
                
                {profile.avatar_url && (
                  <Button
                    size="sm"
                    variant="destructive"
                    className="rounded-full w-8 h-8 p-0"
                    onClick={handleRemoveAvatar}
                    disabled={saving || uploading}
                    title="Remover foto"
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                )}
              </div>
              
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                onChange={handleAvatarUpload}
                className="hidden"
              />
            </div>
            
            <div className="space-y-2">
              <h3 className="text-lg font-medium">Foto de Perfil</h3>
              <p className="text-sm text-gray-600">
                Clique no ícone da câmera para alterar sua foto
              </p>
              <p className="text-xs text-gray-500">
                JPG, PNG, GIF ou WebP. Máximo 2MB.
              </p>
              {uploading && (
                <p className="text-xs text-blue-600 font-medium">
                  Enviando foto...
                </p>
              )}
            </div>
          </div>

          {/* Nome */}
          <div className="space-y-2">
            <Label htmlFor="name">Nome</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              placeholder="Seu nome completo"
              maxLength={100}
              disabled={saving}
            />
          </div>

          {/* Bio */}
          <div className="space-y-2">
            <Label htmlFor="bio">Biografia</Label>
            <Textarea
              id="bio"
              value={formData.bio}
              onChange={(e) => handleInputChange('bio', e.target.value)}
              placeholder="Conte um pouco sobre você..."
              rows={3}
              className="resize-none"
              maxLength={200}
              disabled={saving}
            />
            <p className="text-xs text-gray-500">
              {formData.bio.length}/200 caracteres
            </p>
          </div>

          {/* Save Button */}
          <Button
            onClick={handleSave}
            disabled={saving || uploading}
            className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
          >
            {saving ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Salvando...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Salvar Perfil
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Theme Selector */}
      <ThemeSelector
        selectedTheme={formData.theme}
        onThemeChange={(theme) => handleInputChange('theme', theme)}
      />

      {/* Color Customizer */}
      <ColorCustomizer />

      {/* Social Links Editor */}
      <SocialLinksEditor />
    </div>
  );
}

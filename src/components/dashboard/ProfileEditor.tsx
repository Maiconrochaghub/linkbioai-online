
import { useState, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Label } from "@/components/ui/label";
import { Camera, Loader2, Save } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useAvatar } from "@/hooks/useAvatar";
import { ThemeSelector } from "./ThemeSelector";

export function ProfileEditor() {
  const { user, profile, updateProfile } = useAuth();
  const { uploadAvatar, uploading } = useAvatar();
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

    const { url, error } = await uploadAvatar(file, user.id);
    
    if (error) {
      console.error('Erro no upload:', error);
      return;
    }

    if (url) {
      await updateProfile({ avatar_url: url });
    }
  };

  const handleSave = async () => {
    if (!user) return;
    
    setSaving(true);
    
    const { error } = await updateProfile({
      name: formData.name,
      bio: formData.bio,
      theme: formData.theme
    });
    
    if (error) {
      console.error('Erro ao salvar perfil:', error);
    }
    
    setSaving(false);
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
                <AvatarImage src={profile.avatar_url} />
                <AvatarFallback className="bg-purple-100 text-purple-600 text-2xl font-bold">
                  {profile.name.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <Button
                size="sm"
                variant="secondary"
                className="absolute -bottom-2 -right-2 rounded-full w-8 h-8 p-0"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
              >
                {uploading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Camera className="w-4 h-4" />
                )}
              </Button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
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
                JPG, PNG ou GIF. Máximo 1MB.
              </p>
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
            />
            <p className="text-xs text-gray-500">
              {formData.bio.length}/200 caracteres
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Theme Selector */}
      <ThemeSelector
        selectedTheme={formData.theme}
        onThemeChange={(theme) => handleInputChange('theme', theme)}
      />

      {/* Botão Salvar */}
      <div className="flex justify-end">
        <Button
          onClick={handleSave}
          disabled={saving}
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
      </div>
    </div>
  );
}

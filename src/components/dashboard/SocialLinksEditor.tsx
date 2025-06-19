import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Trash2, Plus, Instagram, Youtube, Linkedin, Twitter, Github, Phone, Mail, Globe, Music } from "lucide-react";
import { useSocialLinks } from "@/hooks/useSocialLinks";

const platformIcons = {
  instagram: <Instagram className="w-4 h-4" />,
  youtube: <Youtube className="w-4 h-4" />,
  linkedin: <Linkedin className="w-4 h-4" />,
  twitter: <Twitter className="w-4 h-4" />,
  github: <Github className="w-4 h-4" />,
  whatsapp: <Phone className="w-4 h-4" />,
  email: <Mail className="w-4 h-4" />,
  website: <Globe className="w-4 h-4" />,
  tiktok: <Music className="w-4 h-4" />,
  facebook: <Globe className="w-4 h-4" />
};

const platformLabels = {
  instagram: 'Instagram',
  youtube: 'YouTube',
  linkedin: 'LinkedIn',
  twitter: 'Twitter/X',
  github: 'GitHub',
  whatsapp: 'WhatsApp',
  email: 'Email',
  website: 'Website',
  tiktok: 'TikTok',
  facebook: 'Facebook'
};

export function SocialLinksEditor() {
  const { socialLinks, loading, addSocialLink, removeSocialLink } = useSocialLinks();
  const [newPlatform, setNewPlatform] = useState('');
  const [newUrl, setNewUrl] = useState('');
  const [adding, setAdding] = useState(false);

  const handleAdd = async () => {
    if (!newPlatform || !newUrl) return;
    
    setAdding(true);
    const { error } = await addSocialLink(newPlatform, newUrl);
    if (!error) {
      setNewPlatform('');
      setNewUrl('');
    }
    setAdding(false);
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <div className="w-6 h-6 border-2 border-purple-200 border-t-purple-600 rounded-full animate-spin"></div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Redes Sociais</CardTitle>
        <CardDescription>
          Adicione suas redes sociais para exibir na sua página pública
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Existing Social Links */}
        <div className="space-y-3">
          {socialLinks.map((link) => (
            <div key={link.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-2 flex-1">
                {platformIcons[link.platform as keyof typeof platformIcons]}
                <span className="font-medium">{platformLabels[link.platform as keyof typeof platformLabels]}</span>
                <span className="text-sm text-gray-500 truncate">{link.url}</span>
              </div>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => removeSocialLink(link.id)}
                className="text-red-500 hover:text-red-700 hover:bg-red-50"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          ))}
          
          {socialLinks.length === 0 && (
            <p className="text-gray-500 text-center py-4">
              Nenhuma rede social adicionada ainda
            </p>
          )}
        </div>

        {/* Add New Social Link */}
        <div className="border-t pt-4 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="platform">Plataforma</Label>
              <Select value={newPlatform} onValueChange={setNewPlatform}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione uma plataforma" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(platformLabels).map(([key, label]) => (
                    <SelectItem key={key} value={key}>
                      <div className="flex items-center gap-2">
                        {platformIcons[key as keyof typeof platformIcons]}
                        {label}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="url">URL</Label>
              <Input
                id="url"
                value={newUrl}
                onChange={(e) => setNewUrl(e.target.value)}
                placeholder="https://..."
                type="url"
              />
            </div>
          </div>
          
          <Button
            onClick={handleAdd}
            disabled={!newPlatform || !newUrl || adding}
            className="w-full"
          >
            {adding ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                Adicionando...
              </>
            ) : (
              <>
                <Plus className="w-4 h-4 mr-2" />
                Adicionar Rede Social
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

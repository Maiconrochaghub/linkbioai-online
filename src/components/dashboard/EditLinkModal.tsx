
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { 
  Link as LinkIcon, 
  Type, 
  Instagram, 
  Youtube, 
  Github, 
  Twitter, 
  Linkedin, 
  Globe,
  Phone,
  Mail,
  Save
} from "lucide-react";
import { Link } from "@/types/link";

interface EditLinkModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdate: (id: string, updates: Partial<Link>) => void;
  link: Link | null;
}

const detectIcon = (url: string): string => {
  try {
    const domain = new URL(url).hostname.toLowerCase();
    
    if (domain.includes('instagram.com')) return 'instagram';
    if (domain.includes('youtube.com')) return 'youtube';
    if (domain.includes('twitter.com') || domain.includes('x.com')) return 'twitter';
    if (domain.includes('linkedin.com')) return 'linkedin';
    if (domain.includes('github.com')) return 'github';
    if (domain.includes('wa.me') || url.includes('whatsapp')) return 'whatsapp';
    if (url.startsWith('mailto:')) return 'email';
    if (url.startsWith('tel:')) return 'phone';
    
    return 'website';
  } catch {
    return 'website';
  }
};

const getIconDisplay = (iconName: string) => {
  const iconMap = {
    instagram: { icon: <Instagram className="w-6 h-6 text-pink-500" />, name: "Instagram" },
    youtube: { icon: <Youtube className="w-6 h-6 text-red-500" />, name: "YouTube" },
    twitter: { icon: <Twitter className="w-6 h-6 text-blue-400" />, name: "Twitter" },
    linkedin: { icon: <Linkedin className="w-6 h-6 text-blue-600" />, name: "LinkedIn" },
    github: { icon: <Github className="w-6 h-6 text-gray-700" />, name: "GitHub" },
    whatsapp: { icon: <Phone className="w-6 h-6 text-green-500" />, name: "WhatsApp" },
    email: { icon: <Mail className="w-6 h-6 text-gray-600" />, name: "Email" },
    phone: { icon: <Phone className="w-6 h-6 text-gray-600" />, name: "Telefone" },
    website: { icon: <Globe className="w-6 h-6 text-blue-500" />, name: "Website" },
  };
  return iconMap[iconName as keyof typeof iconMap] || iconMap.website;
};

export function EditLinkModal({ open, onOpenChange, onUpdate, link }: EditLinkModalProps) {
  const [formData, setFormData] = useState({
    title: "",
    url: "",
    is_active: true
  });
  const [detectedIcon, setDetectedIcon] = useState("website");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // Update form data when link changes
  useEffect(() => {
    if (link) {
      setFormData({
        title: link.title,
        url: link.url,
        is_active: link.is_active
      });
      setDetectedIcon(link.icon);
    }
  }, [link]);

  const handleUrlChange = (url: string) => {
    setFormData(prev => ({ ...prev, url }));
    
    if (url.trim()) {
      const icon = detectIcon(url);
      setDetectedIcon(icon);
    } else {
      setDetectedIcon("website");
    }
  };

  const validateUrl = (url: string): boolean => {
    if (url.startsWith('mailto:') || url.startsWith('tel:')) {
      return true;
    }
    
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!link) return;

    if (!formData.title.trim()) {
      toast({
        title: "Título obrigatório",
        description: "Por favor, insira um título para o link.",
        variant: "destructive"
      });
      return;
    }

    if (!formData.url.trim()) {
      toast({
        title: "URL obrigatória",
        description: "Por favor, insira a URL do link.",
        variant: "destructive"
      });
      return;
    }

    if (!validateUrl(formData.url)) {
      toast({
        title: "URL inválida",
        description: "Por favor, insira uma URL válida.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    
    try {
      const updates = {
        title: formData.title.trim(),
        url: formData.url.trim(),
        icon: detectedIcon,
        is_active: formData.is_active
      };
      
      onUpdate(link.id, updates);
      
      toast({
        title: "Link atualizado! ✅",
        description: `"${updates.title}" foi atualizado com sucesso.`,
      });
      
      setIsLoading(false);
      onOpenChange(false);
    } catch (error) {
      setIsLoading(false);
      toast({
        title: "Erro",
        description: "Erro ao atualizar link. Tente novamente.",
        variant: "destructive"
      });
    }
  };

  const iconDisplay = getIconDisplay(detectedIcon);

  if (!link) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold flex items-center">
            <Save className="w-6 h-6 mr-2 text-purple-600" />
            Editar Link
          </DialogTitle>
          <DialogDescription>
            Faça alterações no seu link
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title Field */}
          <div className="space-y-2">
            <Label htmlFor="edit-title" className="text-sm font-medium">
              Título do Link
            </Label>
            <div className="relative">
              <Type className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                id="edit-title"
                type="text"
                placeholder="Ex: Meu Instagram"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                className="pl-10 h-11"
                maxLength={50}
              />
            </div>
            <p className="text-xs text-gray-500">
              {formData.title.length}/50 caracteres
            </p>
          </div>
          
          {/* URL Field */}
          <div className="space-y-2">
            <Label htmlFor="edit-url" className="text-sm font-medium">
              URL do Link
            </Label>
            <div className="relative">
              <LinkIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                id="edit-url"
                type="url"
                placeholder="https://instagram.com/usuario"
                value={formData.url}
                onChange={(e) => handleUrlChange(e.target.value)}
                className="pl-10 h-11"
              />
            </div>
          </div>

          {/* Active Toggle */}
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="space-y-1">
              <Label className="text-sm font-medium">Status do Link</Label>
              <p className="text-xs text-gray-500">
                {formData.is_active ? "Link ativo e visível na sua página" : "Link desativado"}
              </p>
            </div>
            <Switch
              checked={formData.is_active}
              onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_active: checked }))}
              className="data-[state=checked]:bg-green-500"
            />
          </div>

          {/* Icon Preview */}
          {formData.url && (
            <div className="bg-gray-50 rounded-lg p-4">
              <Label className="text-sm font-medium text-gray-700 mb-2 block">
                Preview do Link
              </Label>
              <div className="flex items-center space-x-3 p-3 bg-white rounded-lg border">
                {iconDisplay.icon}
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900 truncate">
                    {formData.title || "Título do link"}
                  </p>
                  <p className="text-sm text-gray-500">
                    {iconDisplay.name} • {link.click_count} cliques
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex space-x-3 pt-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => onOpenChange(false)}
              className="flex-1"
            >
              Cancelar
            </Button>
            <Button 
              type="submit" 
              className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Salvando...
                </>
              ) : (
                <>
                  Salvar Alterações
                  <Save className="w-4 h-4 ml-2" />
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

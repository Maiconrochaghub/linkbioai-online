
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { 
  MoreVertical, 
  Edit, 
  Trash2, 
  GripVertical, 
  ExternalLink,
  BarChart3,
  Instagram,
  Youtube,
  Github,
  Twitter,
  Linkedin,
  Globe,
  Phone,
  Mail
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import { EditLinkModal } from "./EditLinkModal";
import { Link } from "@/types/link";

interface LinksListProps {
  links: Link[];
  onUpdate: (id: string, updates: Partial<Link>) => void;
  onDelete: (id: string) => void;
  onReorder: (links: Link[]) => void;
}

const getIcon = (iconName: string) => {
  const iconMap = {
    instagram: <Instagram className="w-5 h-5 text-pink-500" />,
    youtube: <Youtube className="w-5 h-5 text-red-500" />,
    twitter: <Twitter className="w-5 h-5 text-blue-400" />,
    linkedin: <Linkedin className="w-5 h-5 text-blue-600" />,
    github: <Github className="w-5 h-5 text-gray-700" />,
    whatsapp: <Phone className="w-5 h-5 text-green-500" />,
    email: <Mail className="w-5 h-5 text-gray-600" />,
    website: <Globe className="w-5 h-5 text-blue-500" />,
  };
  return iconMap[iconName as keyof typeof iconMap] || <Globe className="w-5 h-5 text-gray-500" />;
};

export function LinksList({ links, onUpdate, onDelete, onReorder }: LinksListProps) {
  const [draggedItem, setDraggedItem] = useState<string | null>(null);
  const [editingLink, setEditingLink] = useState<Link | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const { toast } = useToast();

  const sortedLinks = [...links].sort((a, b) => a.position - b.position);

  const handleToggleActive = (id: string, isActive: boolean) => {
    onUpdate(id, { is_active: isActive });
    toast({
      title: isActive ? "Link ativado" : "Link desativado",
      description: isActive ? "O link agora aparece na sua página" : "O link foi removido da sua página"
    });
  };

  const handleDelete = (id: string, title: string) => {
    onDelete(id);
    toast({
      title: "Link removido",
      description: `"${title}" foi removido permanentemente`
    });
  };

  const handleEdit = (link: Link) => {
    setEditingLink(link);
    setShowEditModal(true);
  };

  const handleDragStart = (e: React.DragEvent, id: string) => {
    setDraggedItem(id);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = (e: React.DragEvent, targetId: string) => {
    e.preventDefault();
    
    if (!draggedItem || draggedItem === targetId) {
      setDraggedItem(null);
      return;
    }

    const draggedIndex = sortedLinks.findIndex(link => link.id === draggedItem);
    const targetIndex = sortedLinks.findIndex(link => link.id === targetId);

    if (draggedIndex === -1 || targetIndex === -1) return;

    const newLinks = [...sortedLinks];
    const [removed] = newLinks.splice(draggedIndex, 1);
    newLinks.splice(targetIndex, 0, removed);

    // Update positions
    const updatedLinks = newLinks.map((link, index) => ({
      ...link,
      position: index + 1
    }));

    onReorder(updatedLinks);
    setDraggedItem(null);
    
    toast({
      title: "Links reordenados",
      description: "A nova ordem foi salva"
    });
  };

  const formatUrl = (url: string) => {
    try {
      const urlObj = new URL(url);
      return urlObj.hostname.replace('www.', '');
    } catch {
      return url;
    }
  };

  return (
    <>
      <div className="space-y-3">
        {sortedLinks.map((link) => (
          <div
            key={link.id}
            draggable
            onDragStart={(e) => handleDragStart(e, link.id)}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, link.id)}
            className={`
              bg-white border rounded-lg p-4 transition-all duration-200 hover:shadow-md
              ${draggedItem === link.id ? 'opacity-50 scale-95' : ''}
              ${!link.is_active ? 'opacity-60' : ''}
            `}
          >
            <div className="flex items-center space-x-4">
              {/* Drag Handle */}
              <div className="cursor-grab active:cursor-grabbing text-gray-400 hover:text-gray-600">
                <GripVertical className="w-4 h-4" />
              </div>

              {/* Icon */}
              <div className="flex-shrink-0">
                {getIcon(link.icon)}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-gray-900 truncate">
                      {link.title}
                    </h3>
                    <p className="text-sm text-gray-500 truncate">
                      {formatUrl(link.url)}
                    </p>
                  </div>

                  <div className="flex items-center space-x-3 ml-4">
                    {/* Click Stats */}
                    <div className="flex items-center space-x-1 text-sm text-gray-500">
                      <BarChart3 className="w-4 h-4" />
                      <span>{link.click_count}</span>
                    </div>

                    {/* Active Toggle */}
                    <Switch
                      checked={link.is_active}
                      onCheckedChange={(checked) => handleToggleActive(link.id, checked)}
                      className="data-[state=checked]:bg-green-500"
                    />

                    {/* Actions Menu */}
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild>
                          <a href={link.url} target="_blank" rel="noopener noreferrer" className="cursor-pointer">
                            <ExternalLink className="w-4 h-4 mr-2" />
                            Abrir Link
                          </a>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleEdit(link)}>
                          <Edit className="w-4 h-4 mr-2" />
                          Editar
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          className="text-red-600 focus:text-red-600"
                          onClick={() => handleDelete(link.id, link.title)}
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Excluir
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </div>
            </div>

            {/* Status Badge */}
            <div className="flex justify-between items-center mt-3 pt-3 border-t">
              <Badge variant={link.is_active ? "default" : "secondary"} className="text-xs">
                {link.is_active ? "Ativo" : "Inativo"}
              </Badge>
              
              <span className="text-xs text-gray-400">
                Criado em {new Date(link.created_at).toLocaleDateString('pt-BR')}
              </span>
            </div>
          </div>
        ))}
      </div>

      <EditLinkModal
        open={showEditModal}
        onOpenChange={setShowEditModal}
        onUpdate={onUpdate}
        link={editingLink}
      />
    </>
  );
}

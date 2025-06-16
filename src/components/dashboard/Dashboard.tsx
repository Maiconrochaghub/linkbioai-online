
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  BarChart3, 
  Eye, 
  MousePointer, 
  Plus, 
  Settings, 
  ExternalLink,
  TrendingUp,
  Calendar,
  Share2
} from "lucide-react";
import { LinksList } from "./LinksList";
import { AddLinkModal } from "./AddLinkModal";
import { PagePreview } from "./PagePreview";

interface User {
  id: string;
  name: string;
  email: string;
  username: string;
  avatar_url?: string;
  bio?: string;
}

interface Link {
  id: string;
  title: string;
  url: string;
  icon: string;
  position: number;
  is_active: boolean;
  click_count: number;
  created_at: string;
}

interface DashboardProps {
  user: User;
  onLogout?: () => void;
}

export function Dashboard({ user, onLogout }: DashboardProps) {
  const [links, setLinks] = useState<Link[]>([
    {
      id: "1",
      title: "Meu Instagram",
      url: "https://instagram.com/usuario",
      icon: "instagram",
      position: 1,
      is_active: true,
      click_count: 127,
      created_at: "2025-01-15T10:00:00Z"
    },
    {
      id: "2", 
      title: "Canal YouTube",
      url: "https://youtube.com/channel/usuario",
      icon: "youtube",
      position: 2,
      is_active: true,
      click_count: 89,
      created_at: "2025-01-15T11:00:00Z"
    }
  ]);
  
  const [showAddModal, setShowAddModal] = useState(false);

  const totalClicks = links.reduce((sum, link) => sum + link.click_count, 0);
  const activeLinks = links.filter(link => link.is_active).length;

  const handleAddLink = (newLink: Omit<Link, 'id' | 'position' | 'click_count' | 'created_at'>) => {
    const link: Link = {
      ...newLink,
      id: Date.now().toString(),
      position: links.length + 1,
      click_count: 0,
      created_at: new Date().toISOString()
    };
    setLinks(prev => [...prev, link]);
  };

  const handleUpdateLink = (id: string, updates: Partial<Link>) => {
    setLinks(prev => prev.map(link => 
      link.id === id ? { ...link, ...updates } : link
    ));
  };

  const handleDeleteLink = (id: string) => {
    setLinks(prev => prev.filter(link => link.id !== id));
  };

  const handleReorderLinks = (reorderedLinks: Link[]) => {
    setLinks(reorderedLinks);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">L</span>
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                LinkBio.AI
              </h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <Button variant="outline" size="sm" asChild>
                <a href={`/${user.username}`} target="_blank" className="flex items-center">
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Ver Página
                </a>
              </Button>
              
              <div className="flex items-center space-x-2">
                <Avatar className="w-8 h-8">
                  <AvatarImage src={user.avatar_url} />
                  <AvatarFallback className="bg-purple-100 text-purple-600">
                    {user.name.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <span className="text-sm font-medium">{user.name}</span>
              </div>
              
              <Button variant="ghost" size="sm" onClick={onLogout}>
                <Settings className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Welcome Section */}
            <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl p-6 text-white">
              <h2 className="text-2xl font-bold mb-2">
                Olá, {user.name.split(' ')[0]}! 👋
              </h2>
              <p className="opacity-90 mb-4">
                Sua página está ativa em: <span className="font-semibold">linkbio.ai/{user.username}</span>
              </p>
              <Button variant="secondary" size="sm" className="bg-white/20 border-white/30 text-white hover:bg-white/30">
                <Share2 className="w-4 h-4 mr-2" />
                Compartilhar Página
              </Button>
            </div>

            {/* Stats Cards */}
            <div className="grid md:grid-cols-3 gap-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total de Cliques</CardTitle>
                  <MousePointer className="h-4 w-4 text-purple-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-purple-600">{totalClicks}</div>
                  <p className="text-xs text-muted-foreground">
                    <TrendingUp className="inline w-3 h-3 mr-1" />
                    +12% este mês
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Links Ativos</CardTitle>
                  <Eye className="h-4 w-4 text-green-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">{activeLinks}</div>
                  <p className="text-xs text-muted-foreground">
                    de {links.length} total
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Visitantes</CardTitle>
                  <BarChart3 className="h-4 w-4 text-blue-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-blue-600">847</div>
                  <p className="text-xs text-muted-foreground">
                    <Calendar className="inline w-3 h-3 mr-1" />
                    últimos 30 dias
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Links Management */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Seus Links</CardTitle>
                    <CardDescription>
                      Gerencie e organize seus links
                    </CardDescription>
                  </div>
                  <Button onClick={() => setShowAddModal(true)} className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600">
                    <Plus className="w-4 h-4 mr-2" />
                    Adicionar Link
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {links.length === 0 ? (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Plus className="w-8 h-8 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-medium mb-2">Nenhum link ainda</h3>
                    <p className="text-gray-600 mb-4">Comece adicionando seu primeiro link</p>
                    <Button onClick={() => setShowAddModal(true)} variant="outline">
                      Adicionar Primeiro Link
                    </Button>
                  </div>
                ) : (
                  <LinksList
                    links={links}
                    onUpdate={handleUpdateLink}
                    onDelete={handleDeleteLink}
                    onReorder={handleReorderLinks}
                  />
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <PagePreview user={user} links={links.filter(link => link.is_active)} />
            
            {/* Quick Tips */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">💡 Dicas Rápidas</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="text-sm">
                  <p className="font-medium text-green-700">✅ Adicione 3-5 links principais</p>
                  <p className="text-gray-600">Seus seguidores preferem menos opções</p>
                </div>
                <div className="text-sm">
                  <p className="font-medium text-blue-700">📱 Teste no mobile</p>
                  <p className="text-gray-600">90% dos acessos são pelo celular</p>
                </div>
                <div className="text-sm">
                  <p className="font-medium text-purple-700">📊 Monitore os cliques</p>
                  <p className="text-gray-600">Use os dados para otimizar</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <AddLinkModal
        open={showAddModal}
        onOpenChange={setShowAddModal}
        onAdd={handleAddLink}
      />
    </div>
  );
}

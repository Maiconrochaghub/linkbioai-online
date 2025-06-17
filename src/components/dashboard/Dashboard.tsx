import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
  Share2,
  Shield,
  Users,
  AlertCircle,
  Loader2
} from "lucide-react";
import { LinksList } from "./LinksList";
import { AddLinkModal } from "./AddLinkModal";
import { PagePreview } from "./PagePreview";
import { useAuth } from "@/contexts/AuthContext";
import { useLinks } from "@/hooks/useLinks";
import { useNavigate } from "react-router-dom";

export function Dashboard() {
  const { user, profile, loading, error, signOut, isMasterAdmin, isMaiconRocha } = useAuth();
  const { links, loading: linksLoading, addLink, updateLink, deleteLink, reorderLinks } = useLinks();
  const [showAddModal, setShowAddModal] = useState(false);
  const [dashboardError, setDashboardError] = useState<string | null>(null);
  const navigate = useNavigate();

  // Bypass para Maicon durante desenvolvimento
  const isMaiconBypass = isMaiconRocha() && process.env.NODE_ENV === 'development';

  useEffect(() => {
    console.log('🎯 Dashboard mounted - User:', user?.email, 'Profile:', profile?.name, 'Loading:', loading);
    
    // Timeout de segurança para evitar loading infinito
    const timeoutId = setTimeout(() => {
      if (loading && !user && !isMaiconBypass) {
        console.warn('⚠️ Dashboard timeout - redirecionando para login');
        setDashboardError('Sessão expirada. Redirecionando...');
        setTimeout(() => navigate('/login'), 2000);
      }
    }, 15000);

    return () => clearTimeout(timeoutId);
  }, [loading, user, navigate, isMaiconBypass]);

  // Estado de loading
  if (loading && !isMaiconBypass) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-16 h-16 text-purple-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600 text-lg font-medium">Carregando seu painel...</p>
          <p className="text-gray-500 text-sm mt-2">Verificando autenticação</p>
        </div>
      </div>
    );
  }

  // Erro de autenticação
  if (error || dashboardError) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Erro de Acesso</h2>
          <p className="text-gray-600 mb-4">{error || dashboardError}</p>
          <Button onClick={() => navigate('/login')} className="bg-purple-600 hover:bg-purple-700">
            Fazer Login
          </Button>
        </div>
      </div>
    );
  }

  // Verificação de autenticação (com bypass para Maicon em desenvolvimento)
  if (!user && !isMaiconBypass) {
    navigate('/login');
    return null;
  }

  // Criar perfil mock para Maicon em desenvolvimento se necessário
  const currentProfile = profile || (isMaiconBypass ? {
    id: '14e72f7f-759d-426a-9573-5ef6f5afaf35',
    name: 'Maicon Rocha',
    username: 'maicon',
    theme: 'instagram',
    is_verified: true,
    role: 'master_admin',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  } : null);

  if (!currentProfile) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
          <p className="text-gray-600">Perfil não encontrado. Tente fazer login novamente.</p>
          <Button onClick={() => navigate('/login')} className="mt-4">
            Voltar ao Login
          </Button>
        </div>
      </div>
    );
  }

  const totalClicks = links.reduce((sum, link) => sum + link.click_count, 0);
  const activeLinks = links.filter(link => link.is_active).length;
  const isAdmin = isMasterAdmin() || isMaiconBypass;

  const handleAddLink = async (newLink: { title: string; url: string; is_active: boolean }) => {
    await addLink({
      title: newLink.title,
      url: newLink.url
    });
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
              {(isAdmin || isMaiconBypass) && (
                <div className="flex items-center space-x-1 px-2 py-1 bg-yellow-100 rounded-full">
                  <Shield className="w-3 h-3 text-yellow-600" />
                  <span className="text-xs text-yellow-700 font-medium">
                    {isMaiconBypass ? 'DEV' : 'ADMIN'}
                  </span>
                </div>
              )}
            </div>
            
            <div className="flex items-center space-x-4">
              <Button variant="outline" size="sm" asChild>
                <a href={`/${currentProfile.username}`} target="_blank" className="flex items-center">
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Ver Página
                </a>
              </Button>
              
              {(isAdmin || isMaiconBypass) && (
                <Button variant="outline" size="sm" className="flex items-center">
                  <Users className="w-4 h-4 mr-2" />
                  Gerenciar Usuários
                </Button>
              )}
              
              <div className="flex items-center space-x-2">
                <Avatar className="w-8 h-8">
                  <AvatarImage src={currentProfile.avatar_url} />
                  <AvatarFallback className="bg-purple-100 text-purple-600">
                    {currentProfile.name.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <span className="text-sm font-medium">{currentProfile.name}</span>
              </div>
              
              <Button variant="ghost" size="sm" onClick={signOut}>
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
            <div className={`rounded-xl p-6 text-white ${
              isAdmin || isMaiconBypass
                ? 'bg-gradient-to-r from-yellow-500 to-orange-500' 
                : 'bg-gradient-to-r from-purple-500 to-pink-500'
            }`}>
              <h2 className="text-2xl font-bold mb-2">
                Olá, {currentProfile.name.split(' ')[0]}! 👋
                {(isAdmin || isMaiconBypass) && ' 🛡️'}
              </h2>
              <p className="opacity-90 mb-4">
                {(isAdmin || isMaiconBypass) ? (
                  <>
                    Acesso de <strong>{isMaiconBypass ? 'Desenvolvedor' : 'Administrador Master'}</strong> ativo
                    {isMaiconBypass && ' (Modo Desenvolvimento)'}
                  </>
                ) : (
                  <>Sua página está ativa em: <span className="font-semibold">linkbio.ai/{currentProfile.username}</span></>
                )}
              </p>
              <Button variant="secondary" size="sm" className={
                isAdmin || isMaiconBypass
                  ? "bg-white/20 border-white/30 text-white hover:bg-white/30"
                  : "bg-white/20 border-white/30 text-white hover:bg-white/30"
              }>
                <Share2 className="w-4 h-4 mr-2" />
                {(isAdmin || isMaiconBypass) ? 'Painel Admin' : 'Compartilhar Página'}
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
                    +{Math.floor(totalClicks * 0.12)} este mês
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
                  <div className="text-2xl font-bold text-blue-600">{Math.floor(totalClicks * 0.8)}</div>
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
                {linksLoading ? (
                  <div className="text-center py-8">
                    <Loader2 className="w-8 h-8 text-purple-600 animate-spin mx-auto mb-2" />
                    <p className="text-gray-600">Carregando links...</p>
                  </div>
                ) : links.length === 0 ? (
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
                    onUpdate={updateLink}
                    onDelete={deleteLink}
                    onReorder={reorderLinks}
                  />
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <PagePreview user={currentProfile} links={links.filter(link => link.is_active)} />
            
            {/* Quick Tips */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">
                  {(isAdmin || isMaiconBypass) ? '🛡️ Painel Admin' : '💡 Dicas Rápidas'}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {(isAdmin || isMaiconBypass) ? (
                  <>
                    <div className="text-sm">
                      <p className="font-medium text-yellow-700">🔑 Acesso Total</p>
                      <p className="text-gray-600">Você pode ver e gerenciar todos os dados</p>
                    </div>
                    <div className="text-sm">
                      <p className="font-medium text-purple-700">👥 Gerenciar Usuários</p>
                      <p className="text-gray-600">Visualize e modere contas de usuários</p>
                    </div>
                    <div className="text-sm">
                      <p className="font-medium text-blue-700">📊 Analytics Global</p>
                      <p className="text-gray-600">Acesse estatísticas de todo o sistema</p>
                    </div>
                    {isMaiconBypass && (
                      <div className="text-sm">
                        <p className="font-medium text-red-700">🚧 Modo Desenvolvimento</p>
                        <p className="text-gray-600">Bypass ativo - remover em produção</p>
                      </div>
                    )}
                  </>
                ) : (
                  // ... keep existing code (tips for regular users)
                  <>
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
                  </>
                )}
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

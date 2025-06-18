import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  Loader2,
  User,
  Crown
} from "lucide-react";
import { LinksList } from "./LinksList";
import { AddLinkModal } from "./AddLinkModal";
import { PagePreview } from "./PagePreview";
import { ProfileEditor } from "./ProfileEditor";
import { useAuth } from "@/contexts/AuthContext";
import { useLinks } from "@/hooks/useLinks";
import { useNavigate } from "react-router-dom";
import { ShareModal } from "./ShareModal";
import { PlanLimitAlert } from "./PlanLimitAlert";
import { FounderBadge } from "./FounderBadge";
import { usePlan } from "@/hooks/usePlan";

export function Dashboard() {
  const { user, profile, loading, error, signOut, isMasterAdmin, isMaiconRocha } = useAuth();
  const { links, loading: linksLoading, addLink, updateLink, deleteLink, reorderLinks } = useLinks();
  const { isPro, maxLinks, isFounder, canUpgrade, founderCount, openCustomerPortal } = usePlan();
  
  const [showAddModal, setShowAddModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [dashboardError, setDashboardError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('links');
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
    avatar_url: undefined,
    theme: 'default',
    is_verified: true,
    role: 'master_admin',
    plan: 'pro',
    is_founder: true,
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
    // Check plan limits before adding
    if (!isPro && activeLinks >= maxLinks) {
      return; // The AddLinkModal should handle this check too
    }
    
    await addLink({
      title: newLink.title,
      url: newLink.url
    });
  };

  const handleManageSubscription = async () => {
    try {
      await openCustomerPortal();
    } catch (error) {
      console.error('Error opening customer portal:', error);
    }
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
              
              {/* Plan Badge */}
              <FounderBadge isFounder={isFounder} isPro={isPro} size="sm" />
              
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
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setShowShareModal(true)}
                className="flex items-center"
              >
                <Share2 className="w-4 h-4 mr-2" />
                Compartilhar
              </Button>
              
              <Button variant="outline" size="sm" asChild>
                <a href={`/${currentProfile.username}`} target="_blank" className="flex items-center">
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Ver Página
                </a>
              </Button>
              
              {isPro && (
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleManageSubscription}
                  className="flex items-center"
                >
                  <Settings className="w-4 h-4 mr-2" />
                  Gerenciar Assinatura
                </Button>
              )}
              
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
                : isPro
                ? 'bg-gradient-to-r from-purple-500 to-pink-500'
                : 'bg-gradient-to-r from-blue-500 to-indigo-500'
            }`}>
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold mb-2">
                    Olá, {currentProfile.name.split(' ')[0]}! 👋
                    {(isAdmin || isMaiconBypass) && ' 🛡️'}
                    {isFounder && ' 👑'}
                  </h2>
                  <p className="opacity-90 mb-4">
                    {(isAdmin || isMaiconBypass) ? (
                      <>
                        Acesso de <strong>{isMaiconBypass ? 'Desenvolvedor' : 'Administrador Master'}</strong> ativo
                        {isMaiconBypass && ' (Modo Desenvolvimento)'}
                      </>
                    ) : isPro ? (
                      <>
                        Sua página <strong>{isFounder ? 'Fundador ' : ''}PRO</strong> está ativa em: 
                        <span className="font-semibold"> linkbio.ai/{currentProfile.username}</span>
                      </>
                    ) : (
                      <>
                        Sua página está ativa em: <span className="font-semibold">linkbio.ai/{currentProfile.username}</span>
                        <br />
                        <span className="text-sm opacity-75">Plano Free: {activeLinks}/{maxLinks} links usados</span>
                      </>
                    )}
                  </p>
                </div>
                
                {!isPro && canUpgrade && (
                  <Button 
                    variant="secondary" 
                    size="sm" 
                    onClick={() => window.location.href = '/upgrade'}
                    className="bg-white/20 border-white/30 text-white hover:bg-white/30"
                  >
                    <Crown className="w-4 h-4 mr-2" />
                    Ser Fundador PRO
                  </Button>
                )}
              </div>
            </div>

            {/* Plan Limit Alert */}
            {!isPro && (
              <PlanLimitAlert 
                currentCount={activeLinks} 
                itemType="links" 
                showUpgrade={canUpgrade}
              />
            )}

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
                    {isPro ? 'Ilimitados' : `de ${maxLinks} disponíveis`}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    {isPro ? 'Plano PRO' : 'Visitantes'}
                  </CardTitle>
                  {isPro ? (
                    <Crown className="h-4 w-4 text-yellow-600" />
                  ) : (
                    <BarChart3 className="h-4 w-4 text-blue-600" />
                  )}
                </CardHeader>
                <CardContent>
                  {isPro ? (
                    <>
                      <div className="text-2xl font-bold text-yellow-600">
                        {isFounder ? 'Fundador' : 'Premium'}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        <Shield className="inline w-3 h-3 mr-1" />
                        Recursos ilimitados
                      </p>
                    </>
                  ) : (
                    <>
                      <div className="text-2xl font-bold text-blue-600">{Math.floor(totalClicks * 0.8)}</div>
                      <p className="text-xs text-muted-foreground">
                        <Calendar className="inline w-3 h-3 mr-1" />
                        últimos 30 dias
                      </p>
                    </>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Tabs para Links e Perfil */}
            <Card>
              <CardHeader>
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="links">Meus Links</TabsTrigger>
                    <TabsTrigger value="profile">Editar Perfil</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="links" className="mt-6">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <CardTitle>Seus Links</CardTitle>
                        <CardDescription>
                          Gerencie e organize seus links
                          {!isPro && (
                            <span className="block text-orange-600 font-medium">
                              {activeLinks}/{maxLinks} links usados
                            </span>
                          )}
                        </CardDescription>
                      </div>
                      <Button 
                        onClick={() => setShowAddModal(true)} 
                        disabled={!isPro && activeLinks >= maxLinks}
                        className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Adicionar Link
                      </Button>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="profile" className="mt-6">
                    <div className="flex items-center space-x-2 mb-4">
                      <User className="w-5 h-5 text-purple-600" />
                      <CardTitle>Editar Perfil</CardTitle>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardHeader>
              
              <CardContent>
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                  <TabsContent value="links">
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
                  </TabsContent>
                  
                  <TabsContent value="profile">
                    <ProfileEditor />
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <PagePreview user={currentProfile} links={links.filter(link => link.is_active)} />
            
            {/* Plan Info Card */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  {isPro ? (
                    <>
                      <Crown className="w-5 h-5 text-yellow-500 mr-2" />
                      {isFounder ? 'Fundador PRO' : 'Plano PRO'}
                    </>
                  ) : (
                    <>
                      <Shield className="w-5 h-5 text-blue-500 mr-2" />
                      Plano Free
                    </>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {isPro ? (
                  <>
                    <div className="text-sm">
                      <p className="font-medium text-green-700">✅ Recursos Ilimitados</p>
                      <p className="text-gray-600">Links, temas e analytics sem limite</p>
                    </div>
                    {isFounder && (
                      <div className="text-sm">
                        <p className="font-medium text-yellow-700">👑 Status Fundador</p>
                        <p className="text-gray-600">Você é um dos {founderCount.toLocaleString()} primeiros!</p>
                      </div>
                    )}
                    <div className="text-sm">
                      <p className="font-medium text-purple-700">🛠️ Gerenciar Assinatura</p>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={handleManageSubscription}
                        className="mt-2"
                      >
                        Abrir Portal do Cliente
                      </Button>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="text-sm">
                      <p className="font-medium text-blue-700">📊 Seu Uso Atual</p>
                      <p className="text-gray-600">{activeLinks}/{maxLinks} links • 1/4 temas</p>
                    </div>
                    {canUpgrade && (
                      <div className="text-sm">
                        <p className="font-medium text-purple-700">🚀 Upgrade Disponível</p>
                        <p className="text-gray-600 mb-2">Seja um dos {(10000 - founderCount).toLocaleString()} fundadores restantes!</p>
                        <Button 
                          size="sm" 
                          onClick={() => window.location.href = '/upgrade'}
                          className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                        >
                          <Crown className="w-4 h-4 mr-1" />
                          $1/mês
                        </Button>
                      </div>
                    )}
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
      
      <ShareModal
        open={showShareModal}
        onOpenChange={setShowShareModal}
        username={currentProfile.username}
      />
    </div>
  );
}

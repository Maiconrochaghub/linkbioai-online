import { lazy, Suspense, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
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
  Loader2,
  User,
  Crown
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContextOptimized";
import { useLinks } from "@/hooks/useLinks";
import { usePlan } from "@/hooks/usePlan";
import { useSlowConnection } from "@/hooks/useSlowConnection";

// Lazy load componentes pesados
const LinksList = lazy(() => import("./LinksList").then(m => ({ default: m.LinksList })));
const PagePreview = lazy(() => import("./PagePreview").then(m => ({ default: m.PagePreview })));
const ProfileEditor = lazy(() => import("./ProfileEditor").then(m => ({ default: m.ProfileEditor })));
const AddLinkModal = lazy(() => import("./AddLinkModal").then(m => ({ default: m.AddLinkModal })));
const ShareModal = lazy(() => import("./ShareModal").then(m => ({ default: m.ShareModal })));
const PlanLimitAlert = lazy(() => import("./PlanLimitAlert").then(m => ({ default: m.PlanLimitAlert })));
const FounderBadge = lazy(() => import("./FounderBadge").then(m => ({ default: m.FounderBadge })));
const InstallButton = lazy(() => import("@/components/pwa/InstallButton").then(m => ({ default: m.InstallButton })));
const UpdateNotification = lazy(() => import("@/components/pwa/UpdateNotification").then(m => ({ default: m.UpdateNotification })));

// Skeleton para os cards de estatísticas
function StatsCardSkeleton() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-4 w-4 rounded" />
      </CardHeader>
      <CardContent>
        <Skeleton className="h-8 w-16 mb-2" />
        <Skeleton className="h-3 w-20" />
      </CardContent>
    </Card>
  );
}

// Skeleton para o preview da página
function PagePreviewSkeleton() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <Skeleton className="h-5 w-32 mb-2" />
            <Skeleton className="h-4 w-48" />
          </div>
          <Skeleton className="h-8 w-16" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="bg-gray-900 rounded-2xl p-2 mx-auto shadow-2xl" style={{ width: '280px' }}>
          <div className="bg-white rounded-xl overflow-hidden" style={{ height: '500px' }}>
            <div className="p-6 text-center">
              <Skeleton className="w-20 h-20 rounded-full mx-auto mb-4" />
              <Skeleton className="h-6 w-32 mx-auto mb-2" />
              <Skeleton className="h-4 w-24 mx-auto mb-4" />
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-12 w-full rounded-xl" />
                ))}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function DashboardOptimized() {
  const { user, profile, loading, signOut, isMasterAdmin, isMaiconRocha } = useAuth();
  const { links, loading: linksLoading, addLink, updateLink, deleteLink, reorderLinks } = useLinks();
  const { isPro, maxLinks, isFounder, canUpgrade, founderCount, openCustomerPortal } = usePlan();
  const isSlowConnection = useSlowConnection();
  
  const [showAddModal, setShowAddModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [activeTab, setActiveTab] = useState('links');

  // Loading state melhorado
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center mx-auto">
            <span className="text-white font-bold text-xl">L</span>
          </div>
          <Loader2 className="w-8 h-8 text-purple-600 animate-spin mx-auto" />
          <div className="space-y-2">
            <p className="text-gray-600 text-lg font-medium">Carregando seu painel...</p>
            <p className="text-gray-500 text-sm">Aguarde um momento</p>
          </div>
        </div>
      </div>
    );
  }

  // Verificação de estado melhorada
  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-red-100 rounded-lg flex items-center justify-center mx-auto">
            <span className="text-red-600 font-bold text-xl">!</span>
          </div>
          <div className="space-y-2">
            <p className="text-gray-600 text-lg font-medium">Acesso não autorizado</p>
            <p className="text-gray-500 text-sm">Redirecionando para login...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-yellow-100 rounded-lg flex items-center justify-center mx-auto">
            <User className="w-8 h-8 text-yellow-600" />
          </div>
          <div className="space-y-2">
            <p className="text-gray-600 text-lg font-medium">Carregando perfil...</p>
            <Loader2 className="w-6 h-6 text-yellow-600 animate-spin mx-auto" />
          </div>
        </div>
      </div>
    );
  }

  const totalClicks = links.reduce((sum, link) => sum + link.click_count, 0);
  const activeLinks = links.filter(link => link.is_active).length;
  const isAdmin = isMasterAdmin() || isMaiconRocha();

  const handleAddLink = async (newLink: { title: string; url: string; is_active: boolean }) => {
    if (!isPro && activeLinks >= maxLinks) {
      return;
    }
    
    try {
      console.log('🔗 Dashboard: Adicionando link via useLinks:', newLink);
      await addLink({
        title: newLink.title,
        url: newLink.url
      });
    } catch (error) {
      console.error('❌ Dashboard: Erro ao adicionar link:', error);
      throw error;
    }
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
              
              <Suspense fallback={<Skeleton className="h-6 w-20" />}>
                <FounderBadge isFounder={isFounder} isPro={isPro} size="sm" />
              </Suspense>
              
              {isAdmin && (
                <div className="flex items-center space-x-1 px-2 py-1 bg-yellow-100 rounded-full">
                  <Shield className="w-3 h-3 text-yellow-600" />
                  <span className="text-xs text-yellow-700 font-medium">ADMIN</span>
                </div>
              )}
            </div>
            
            <div className="flex items-center space-x-4">
              {!isSlowConnection && (
                <Suspense fallback={<Skeleton className="h-8 w-24" />}>
                  <InstallButton variant="outline" size="sm" />
                </Suspense>
              )}
              
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
                <a href={`/${profile.username}`} target="_blank" className="flex items-center">
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Ver Página
                </a>
              </Button>
              
              <div className="flex items-center space-x-2">
                <Avatar className="w-8 h-8">
                  <AvatarImage src={profile.avatar_url} />
                  <AvatarFallback className="bg-purple-100 text-purple-600">
                    {profile.name.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <span className="text-sm font-medium hidden sm:inline">{profile.name}</span>
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
              isAdmin
                ? 'bg-gradient-to-r from-yellow-500 to-orange-500' 
                : isPro
                ? 'bg-gradient-to-r from-purple-500 to-pink-500'
                : 'bg-gradient-to-r from-blue-500 to-indigo-500'
            }`}>
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold mb-2">
                    Olá, {profile.name.split(' ')[0]}! 👋
                    {isAdmin && ' 🛡️'}
                    {isFounder && ' 👑'}
                  </h2>
                  <p className="opacity-90 mb-4">
                    {isAdmin ? (
                      <>Acesso de <strong>Administrador Master</strong> ativo</>
                    ) : isPro ? (
                      <>
                        Sua página <strong>{isFounder ? 'Fundador ' : ''}PRO</strong> está ativa em: 
                        <span className="font-semibold"> linkbio.ai/{profile.username}</span>
                      </>
                    ) : (
                      <>
                        Sua página está ativa em: <span className="font-semibold">linkbio.ai/{profile.username}</span>
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
              <Suspense fallback={<Skeleton className="h-16 w-full" />}>
                <PlanLimitAlert 
                  currentCount={activeLinks} 
                  itemType="links" 
                  showUpgrade={canUpgrade}
                />
              </Suspense>
            )}

            {/* Stats Cards */}
            <div className="grid md:grid-cols-3 gap-4">
              {linksLoading ? (
                <>
                  <StatsCardSkeleton />
                  <StatsCardSkeleton />
                  <StatsCardSkeleton />
                </>
              ) : (
                <>
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
                </>
              )}
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
                        <Button 
                          onClick={() => setShowAddModal(true)} 
                          variant="outline"
                          disabled={!isPro && activeLinks >= maxLinks}
                        >
                          Adicionar Primeiro Link
                        </Button>
                      </div>
                    ) : (
                      <Suspense fallback={
                        <div className="space-y-4">
                          {[1, 2, 3].map((i) => (
                            <Skeleton key={i} className="h-16 w-full" />
                          ))}
                        </div>
                      }>
                        <LinksList
                          links={links}
                          onUpdate={updateLink}
                          onDelete={deleteLink}
                          onReorder={reorderLinks}
                        />
                      </Suspense>
                    )}
                  </TabsContent>
                  
                  <TabsContent value="profile">
                    <Suspense fallback={
                      <div className="space-y-4">
                        <Skeleton className="h-32 w-32 rounded-full mx-auto" />
                        <Skeleton className="h-10 w-full" />
                        <Skeleton className="h-10 w-full" />
                        <Skeleton className="h-20 w-full" />
                      </div>
                    }>
                      <ProfileEditor />
                    </Suspense>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Suspense fallback={<PagePreviewSkeleton />}>
              <PagePreview user={profile} links={links.filter(link => link.is_active)} />
            </Suspense>
            
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

      <Suspense fallback={null}>
        <AddLinkModal
          open={showAddModal}
          onOpenChange={setShowAddModal}
          onAdd={handleAddLink}
        />
      </Suspense>
      
      <Suspense fallback={null}>
        <ShareModal
          open={showShareModal}
          onOpenChange={setShowShareModal}
          username={profile.username}
        />
      </Suspense>
      
      {/* PWA Update Notification */}
      {!isSlowConnection && (
        <Suspense fallback={null}>
          <UpdateNotification />
        </Suspense>
      )}
    </div>
  );
}

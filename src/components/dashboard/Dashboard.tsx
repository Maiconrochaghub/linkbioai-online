
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2 } from "lucide-react";
import { DashboardHeader } from "./DashboardHeader";
import { WelcomeSection } from "./WelcomeSection";
import { StatsCards } from "./StatsCards";
import { LinksTabContent } from "./LinksTabContent";
import { PagePreview } from "./PagePreview";
import { PlanInfoCard } from "./PlanInfoCard";
import { AddLinkModal } from "./AddLinkModal";
import { ShareModal } from "./ShareModal";
import { PlanLimitAlert } from "./PlanLimitAlert";
import { useAuth } from "@/contexts/AuthContext";
import { useLinks } from "@/hooks/useLinks";
import { usePlan } from "@/hooks/usePlan";

export function Dashboard() {
  const { user, profile, loading } = useAuth();
  const { links, loading: linksLoading, addLink, updateLink, deleteLink, reorderLinks } = useLinks();
  const { isPro, maxLinks, canUpgrade, openCustomerPortal } = usePlan();
  
  const [showAddModal, setShowAddModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [activeTab, setActiveTab] = useState('links');

  // Loading state
  if (loading || !user || !profile) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-16 h-16 text-purple-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600 text-lg font-medium">Carregando seu painel...</p>
        </div>
      </div>
    );
  }

  const activeLinks = links.filter(link => link.is_active).length;

  const handleAddLink = async (newLink: { title: string; url: string; is_active: boolean }) => {
    if (!isPro && activeLinks >= maxLinks) {
      return;
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
      <DashboardHeader 
        onShareClick={() => setShowShareModal(true)}
        onManageSubscription={handleManageSubscription}
      />

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <WelcomeSection />

            {/* Plan Limit Alert */}
            {!isPro && (
              <PlanLimitAlert 
                currentCount={activeLinks} 
                itemType="links" 
                showUpgrade={canUpgrade}
              />
            )}

            <StatsCards links={links} />

            {/* Main Tabs */}
            <Card>
              <CardContent className="p-6">
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                  <TabsList className="grid w-full grid-cols-2 mb-6">
                    <TabsTrigger value="links">Meus Links</TabsTrigger>
                    <TabsTrigger value="profile">Editar Perfil</TabsTrigger>
                  </TabsList>
                  
                  <LinksTabContent
                    activeTab={activeTab}
                    links={links}
                    linksLoading={linksLoading}
                    onAddLink={() => setShowAddModal(true)}
                    onUpdateLink={updateLink}
                    onDeleteLink={deleteLink}
                    onReorderLinks={reorderLinks}
                  />
                </Tabs>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <PagePreview user={profile} links={links.filter(link => link.is_active)} />
            <PlanInfoCard 
              activeLinks={activeLinks}
              onManageSubscription={handleManageSubscription}
            />
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
        username={profile.username}
      />
    </div>
  );
}

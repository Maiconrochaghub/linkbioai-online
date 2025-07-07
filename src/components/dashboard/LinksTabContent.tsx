
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Plus, 
  Loader2,
  Globe,
  Palette,
  User
} from "lucide-react";
import { LinksList } from "./LinksList";
import { SocialLinksEditor } from "./SocialLinksEditor";
import { ColorCustomizer } from "./ColorCustomizer";
import { ProfileEditor } from "./ProfileEditor";
import { usePlan } from "@/hooks/usePlan";

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

interface LinksTabContentProps {
  activeTab: string;
  links: Link[];
  linksLoading: boolean;
  onAddLink: () => void;
  onUpdateLink: (id: string, updates: Partial<Link>) => void;
  onDeleteLink: (id: string) => void;
  onReorderLinks: (links: Link[]) => void;
}

export function LinksTabContent({
  activeTab,
  links,
  linksLoading,
  onAddLink,
  onUpdateLink,
  onDeleteLink,
  onReorderLinks
}: LinksTabContentProps) {
  const [linksSubTab, setLinksSubTab] = useState('my-links');
  const { isPro, maxLinks } = usePlan();
  
  const activeLinks = links.filter(link => link.is_active).length;

  return (
    <Tabs value={activeTab} className="w-full">
      <TabsContent value="links">
        <Tabs value={linksSubTab} onValueChange={setLinksSubTab} className="w-full mt-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="my-links">Links</TabsTrigger>
            <TabsTrigger value="social-links">
              <Globe className="w-4 h-4 mr-2" />
              Redes Sociais
            </TabsTrigger>
            <TabsTrigger value="colors">
              <Palette className="w-4 h-4 mr-2" />
              Cores
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="my-links" className="mt-6">
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
                onClick={onAddLink} 
                disabled={!isPro && activeLinks >= maxLinks}
                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
              >
                <Plus className="w-4 h-4 mr-2" />
                Adicionar Link
              </Button>
            </div>

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
                <Button onClick={onAddLink} variant="outline">
                  Adicionar Primeiro Link
                </Button>
              </div>
            ) : (
              <LinksList
                links={links}
                onUpdate={onUpdateLink}
                onDelete={onDeleteLink}
                onReorder={onReorderLinks}
              />
            )}
          </TabsContent>
          
          <TabsContent value="social-links" className="mt-6">
            <div className="flex items-center space-x-2 mb-4">
              <Globe className="w-5 h-5 text-purple-600" />
              <CardTitle>Redes Sociais</CardTitle>
            </div>
            <SocialLinksEditor />
          </TabsContent>
          
          <TabsContent value="colors" className="mt-6">
            <div className="flex items-center space-x-2 mb-4">
              <Palette className="w-5 h-5 text-purple-600" />
              <CardTitle>Personalização de Cores</CardTitle>
            </div>
            <ColorCustomizer />
          </TabsContent>
        </Tabs>
      </TabsContent>
      
      <TabsContent value="profile" className="mt-6">
        <div className="flex items-center space-x-2 mb-4">
          <User className="w-5 h-5 text-purple-600" />
          <CardTitle>Editar Perfil</CardTitle>
        </div>
        <ProfileEditor />
      </TabsContent>
    </Tabs>
  );
}


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
import { SocialLinksEditor } from "./SocialLinksEditor";
import { ColorCustomizer } from "./ColorCustomizer";
import { ProfileEditor } from "./ProfileEditor";
import { LinksManager } from "./LinksManager";
import { Link } from "@/types/link";

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
            <LinksManager
              links={links}
              linksLoading={linksLoading}
              onAddLink={onAddLink}
              onUpdateLink={onUpdateLink}
              onDeleteLink={onDeleteLink}
              onReorderLinks={onReorderLinks}
            />
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

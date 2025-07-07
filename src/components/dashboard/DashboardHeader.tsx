
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { 
  Settings, 
  ExternalLink,
  Share2,
  Shield,
  Users,
  Crown
} from "lucide-react";
import { FounderBadge } from "./FounderBadge";
import { useAuth } from "@/contexts/AuthContext";
import { usePlan } from "@/hooks/usePlan";

interface DashboardHeaderProps {
  onShareClick: () => void;
  onManageSubscription: () => void;
}

export function DashboardHeader({ onShareClick, onManageSubscription }: DashboardHeaderProps) {
  const { user, profile, signOut, isMasterAdmin, isMaiconRocha } = useAuth();
  const { isPro, isFounder } = usePlan();
  
  if (!user || !profile) return null;
  
  const isAdmin = isMasterAdmin() || isMaiconRocha();

  return (
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
            
            <FounderBadge isFounder={isFounder} isPro={isPro} size="sm" />
            
            {isAdmin && (
              <div className="flex items-center space-x-1 px-2 py-1 bg-yellow-100 rounded-full">
                <Shield className="w-3 h-3 text-yellow-600" />
                <span className="text-xs text-yellow-700 font-medium">ADMIN</span>
              </div>
            )}
          </div>
          
          <div className="flex items-center space-x-4">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={onShareClick}
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
            
            {isPro && (
              <Button 
                variant="outline" 
                size="sm" 
                onClick={onManageSubscription}
                className="flex items-center"
              >
                <Settings className="w-4 h-4 mr-2" />
                Gerenciar Assinatura
              </Button>
            )}
            
            {isAdmin && (
              <Button variant="outline" size="sm" className="flex items-center">
                <Users className="w-4 h-4 mr-2" />
                Gerenciar Usuários
              </Button>
            )}
            
            <div className="flex items-center space-x-2">
              <Avatar className="w-8 h-8">
                <AvatarImage src={profile.avatar_url} />
                <AvatarFallback className="bg-purple-100 text-purple-600">
                  {profile.name.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <span className="text-sm font-medium">{profile.name}</span>
            </div>
            
            <Button variant="ghost" size="sm" onClick={signOut}>
              <Settings className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}

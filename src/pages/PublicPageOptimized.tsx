
import { useState, useEffect, memo } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { ExternalLink, Instagram, Youtube, Github, Twitter, Linkedin, Globe, Phone, Mail, Crown, Shield } from 'lucide-react';
import { usePublicPage } from '@/hooks/usePublicPage';
import { useSlowConnection } from '@/hooks/useSlowConnection';

// Memoized link item component para evitar re-renders desnecessários
const LinkItem = memo(({ link, onTrackClick }: { 
  link: any, 
  onTrackClick: (linkId: string, url: string) => void 
}) => {
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

  return (
    <Button
      variant="outline"
      className="w-full h-auto p-4 rounded-xl bg-white hover:bg-gray-50 border-gray-200 shadow-sm hover:shadow-md transition-all duration-200 group"
      onClick={() => onTrackClick(link.id, link.url)}
    >
      <div className="flex items-center space-x-3 w-full">
        <div className="flex-shrink-0">
          {getIcon(link.icon)}
        </div>
        <div className="flex-1 text-left">
          <p className="font-medium text-gray-900 group-hover:text-purple-600 transition-colors">
            {link.title}
          </p>
          {link.click_count > 0 && (
            <p className="text-xs text-gray-500 mt-1">
              {link.click_count} {link.click_count === 1 ? 'clique' : 'cliques'}
            </p>
          )}
        </div>
        <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-purple-600 transition-colors" />
      </div>
    </Button>
  );
});

LinkItem.displayName = 'LinkItem';

// Skeleton para página pública
function PublicPageSkeleton() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 py-8">
      <div className="container mx-auto px-4 max-w-md">
        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
          <div className="p-8 text-center space-y-6">
            {/* Avatar skeleton */}
            <Skeleton className="w-24 h-24 rounded-full mx-auto" />
            
            {/* Name and bio skeleton */}
            <div className="space-y-2">
              <Skeleton className="h-6 w-32 mx-auto" />
              <Skeleton className="h-4 w-48 mx-auto" />
              <Skeleton className="h-4 w-20 mx-auto" />
            </div>
            
            {/* Links skeleton */}
            <div className="space-y-3">
              {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} className="h-14 w-full rounded-xl" />
              ))}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

export default function PublicPageOptimized() {
  const { username } = useParams<{ username: string }>();
  const { data, loading, error, trackClick } = usePublicPage(username!);
  const isSlowConnection = useSlowConnection();
  const [imageLoaded, setImageLoaded] = useState(false);

  // Preload da imagem do avatar para melhor UX
  useEffect(() => {
    if (data?.profile?.avatar_url) {
      const img = new Image();
      img.onload = () => setImageLoaded(true);
      img.src = data.profile.avatar_url;
    }
  }, [data?.profile?.avatar_url]);

  if (loading) {
    return <PublicPageSkeleton />;
  }

  if (error || !data) {
    return <Navigate to="/404" replace />;
  }

  const { profile, links } = data;

  const handleLinkClick = async (linkId: string, url: string) => {
    try {
      // Track click em background
      trackClick(linkId);
      
      // Abrir link
      window.open(url, '_blank', 'noopener,noreferrer');
    } catch (error) {
      console.error('Error tracking click:', error);
      // Ainda assim abrir o link
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  };

  const getThemeBackground = (theme: string) => {
    const themeMap = {
      default: 'bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50',
      clean: 'bg-gray-50',
      dark: 'bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white',
      instagram: 'bg-gradient-to-br from-pink-400 via-red-500 to-yellow-500'
    };
    return themeMap[theme as keyof typeof themeMap] || themeMap.default;
  };

  return (
    <div className={`min-h-screen py-4 sm:py-8 ${getThemeBackground(profile.theme || 'default')}`}>
      <div className="container mx-auto px-4 max-w-md">
        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
          <div className="p-6 sm:p-8 text-center space-y-6">
            {/* Profile Section */}
            <div className="space-y-4">
              <div className="relative">
                <Avatar className="w-20 h-20 sm:w-24 sm:h-24 mx-auto border-4 border-white shadow-lg">
                  {imageLoaded || !isSlowConnection ? (
                    <AvatarImage 
                      src={profile.avatar_url} 
                      alt={profile.name}
                      loading="eager"
                    />
                  ) : (
                    <Skeleton className="w-full h-full rounded-full" />
                  )}
                  <AvatarFallback className="bg-purple-100 text-purple-600 text-xl font-bold">
                    {profile.name.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                
                {/* Status badges */}
                {(profile.is_founder || profile.is_admin) && (
                  <div className="absolute -top-1 -right-1">
                    {profile.is_admin ? (
                      <div className="w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center">
                        <Shield className="w-3 h-3 text-white" />
                      </div>
                    ) : profile.is_founder ? (
                      <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center">
                        <Crown className="w-3 h-3 text-white" />
                      </div>
                    ) : null}
                  </div>
                )}
              </div>
              
              <div className="space-y-2">
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
                  {profile.name}
                  {profile.is_founder && (
                    <Crown className="inline w-4 h-4 ml-2 text-yellow-600" />
                  )}
                  {profile.is_admin && (
                    <Shield className="inline w-4 h-4 ml-2 text-yellow-600" />
                  )}
                </h1>
                
                {profile.bio && (
                  <p className="text-sm sm:text-base text-gray-600 leading-relaxed px-2">
                    {profile.bio}
                  </p>
                )}
                
                <Badge 
                  variant="secondary" 
                  className={`text-xs ${
                    profile.plan === 'pro' || profile.is_founder 
                      ? 'bg-purple-100 text-purple-700' 
                      : 'bg-gray-100 text-gray-700'
                  }`}
                >
                  @{profile.username}
                  {(profile.plan === 'pro' || profile.is_founder) && (
                    <Crown className="w-3 h-3 ml-1" />
                  )}
                </Badge>
              </div>
            </div>

            {/* Links Section */}
            <div className="space-y-3">
              {links.length === 0 ? (
                <div className="py-8">
                  <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Globe className="w-6 h-6 text-gray-400" />
                  </div>
                  <p className="text-sm text-gray-500">
                    Nenhum link disponível no momento
                  </p>
                </div>
              ) : (
                links.map((link) => (
                  <LinkItem
                    key={link.id}
                    link={link}
                    onTrackClick={handleLinkClick}
                  />
                ))
              )}
            </div>

            {/* Footer */}
            <div className="pt-6 border-t border-gray-200">
              <p className="text-xs text-gray-400">
                Criado com{' '}
                <a 
                  href="https://linkbio.ai" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-purple-500 hover:text-purple-600 font-medium"
                >
                  LinkBio.AI
                </a>
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

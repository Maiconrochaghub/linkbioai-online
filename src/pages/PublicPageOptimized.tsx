
import { useState, useEffect, memo } from 'react';
import { useParams } from 'react-router-dom';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ExternalLink, Instagram, Youtube, Github, Twitter, Linkedin, Globe, Phone, Mail, Crown, Shield } from 'lucide-react';
import { usePublicPageOptimized } from '@/hooks/usePublicPageOptimized';
import { LoadingSkeletonOptimized } from '@/components/ui/loading-skeleton-optimized';
import { MobileOptimizations } from '@/components/mobile/MobileOptimizations';

// Componente de link otimizado com feedback visual
const LinkItem = memo(({ link, onTrackClick, buttonColor, isOptimistic = false }: { 
  link: any, 
  onTrackClick: (linkId: string, url: string) => void,
  buttonColor: string,
  isOptimistic?: boolean
}) => {
  const [isClicking, setIsClicking] = useState(false);

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

  const handleClick = async () => {
    setIsClicking(true);
    try {
      await onTrackClick(link.id, link.url);
    } finally {
      // Delay para mostrar feedback visual
      setTimeout(() => setIsClicking(false), 300);
    }
  };

  return (
    <Button
      variant="outline"
      className={`
        w-full h-auto p-4 rounded-xl border-0 shadow-sm hover:shadow-md 
        transition-all duration-200 group touch-manipulation min-h-[56px]
        ${isClicking ? 'scale-95 shadow-inner' : 'hover:scale-[1.02]'}
        ${isOptimistic ? 'opacity-80' : ''}
      `}
      style={{ backgroundColor: buttonColor }}
      onClick={handleClick}
      disabled={isClicking}
    >
      <div className="flex items-center space-x-3 w-full">
        <div className="flex-shrink-0">
          {getIcon(link.icon)}
        </div>
        <div className="flex-1 text-left">
          <p className="font-medium text-white group-hover:text-gray-100 transition-colors text-sm sm:text-base">
            {link.title}
          </p>
          {link.click_count > 0 && (
            <p className="text-xs text-white/70 mt-1">
              {link.click_count} {link.click_count === 1 ? 'clique' : 'cliques'}
            </p>
          )}
        </div>
        <ExternalLink className={`w-4 h-4 text-white/70 transition-all ${isClicking ? 'animate-pulse' : ''}`} />
      </div>
    </Button>
  );
});

LinkItem.displayName = 'LinkItem';

export default function PublicPageOptimized() {
  const { username } = useParams<{ username: string }>();
  const { data, loading, error, trackClick } = usePublicPageOptimized(username!);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [clickingLinks, setClickingLinks] = useState<Set<string>>(new Set());

  // Preload avatar otimizado
  useEffect(() => {
    if (data?.profile?.avatar_url) {
      const img = new Image();
      img.onload = () => setImageLoaded(true);
      img.onerror = () => setImageLoaded(true);
      img.src = data.profile.avatar_url;
    } else {
      setImageLoaded(true);
    }
  }, [data?.profile?.avatar_url]);

  if (loading) {
    return (
      <MobileOptimizations>
        <LoadingSkeletonOptimized type="profile" count={3} />
      </MobileOptimizations>
    );
  }

  if (error || !data) {
    return (
      <MobileOptimizations>
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 py-8 flex items-center justify-center px-4">
          <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg max-w-md w-full">
            <div className="p-8 text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-red-500" />
              </div>
              <h1 className="text-xl font-bold text-gray-900 mb-2">Página não encontrada</h1>
              <p className="text-gray-600 mb-4">
                O usuário que você está procurando não existe ou não está disponível.
              </p>
              <Button 
                onClick={() => window.location.href = '/'}
                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 min-h-[44px]"
              >
                Voltar ao início
              </Button>
            </div>
          </Card>
        </div>
      </MobileOptimizations>
    );
  }

  const { profile, links } = data;

  const handleLinkClick = async (linkId: string, url: string) => {
    try {
      // Adicionar à lista de clicking para feedback visual
      setClickingLinks(prev => new Set(prev.add(linkId)));
      
      // Track click e abrir link
      await trackClick(linkId);
      window.open(url, '_blank', 'noopener,noreferrer');
    } catch (error) {
      console.error('Error handling link click:', error);
      window.open(url, '_blank', 'noopener,noreferrer');
    } finally {
      // Remover da lista após delay
      setTimeout(() => {
        setClickingLinks(prev => {
          const newSet = new Set(prev);
          newSet.delete(linkId);
          return newSet;
        });
      }, 300);
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
    <MobileOptimizations>
      <div className={`min-h-screen py-4 sm:py-8 ${getThemeBackground(profile.theme || 'default')}`}>
        <div className="container mx-auto px-4 max-w-md">
          <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg">
            <div className="p-6 sm:p-8 text-center space-y-4 sm:space-y-6">
              {/* Profile Section */}
              <div className="space-y-3 sm:space-y-4">
                <div className="relative">
                  <Avatar className="w-20 h-20 sm:w-24 sm:h-24 mx-auto border-4 border-white shadow-lg">
                    {imageLoaded ? (
                      <AvatarImage 
                        src={profile.avatar_url} 
                        alt={profile.name}
                        loading="eager"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-200 animate-pulse rounded-full" />
                    )}
                    <AvatarFallback className="bg-purple-100 text-purple-600 text-lg sm:text-xl font-bold">
                      {profile.name.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  
                  {/* Status badges */}
                  {(profile.is_founder || profile.is_admin) && (
                    <div className="absolute -top-1 -right-1">
                      {profile.is_admin ? (
                        <div className="w-5 h-5 sm:w-6 sm:h-6 bg-yellow-500 rounded-full flex items-center justify-center">
                          <Shield className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-white" />
                        </div>
                      ) : profile.is_founder ? (
                        <div className="w-5 h-5 sm:w-6 sm:h-6 bg-purple-500 rounded-full flex items-center justify-center">
                          <Crown className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-white" />
                        </div>
                      ) : null}
                    </div>
                  )}
                </div>
                
                <div className="space-y-2">
                  <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900">
                    {profile.name}
                    {profile.is_founder && (
                      <Crown className="inline w-3 h-3 sm:w-4 sm:h-4 ml-2 text-yellow-600" />
                    )}
                    {profile.is_admin && (
                      <Shield className="inline w-3 h-3 sm:w-4 sm:h-4 ml-2 text-yellow-600" />
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
                  <div className="py-6 sm:py-8">
                    <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Globe className="w-6 h-6 text-gray-400" />
                    </div>
                    <h3 className="text-base sm:text-lg font-medium mb-2">Nenhum link disponível</h3>
                    <p className="text-sm text-gray-500">
                      Este perfil ainda não possui links
                    </p>
                  </div>
                ) : (
                  links.map((link) => (
                    <LinkItem
                      key={link.id}
                      link={link}
                      onTrackClick={handleLinkClick}
                      buttonColor={profile.button_color || '#8B5CF6'}
                      isOptimistic={clickingLinks.has(link.id)}
                    />
                  ))
                )}
              </div>

              {/* Footer */}
              <div className="pt-4 sm:pt-6 border-t border-gray-200">
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
    </MobileOptimizations>
  );
}

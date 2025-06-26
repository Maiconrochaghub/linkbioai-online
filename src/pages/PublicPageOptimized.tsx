import { useParams } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Instagram, 
  Youtube, 
  Github, 
  Twitter, 
  Linkedin, 
  Globe, 
  Phone, 
  Mail,
  ExternalLink,
  ArrowRight,
  Music,
  RefreshCw,
  Wifi,
  WifiOff
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { usePublicPage } from "@/hooks/usePublicPage";
import { Skeleton } from "@/components/ui/skeleton";
import { useEffect, useState } from "react";

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
    tiktok: <Music className="w-5 h-5 text-black" />,
    facebook: <Globe className="w-5 h-5 text-blue-600" />,
  };
  return iconMap[iconName as keyof typeof iconMap] || <Globe className="w-5 h-5 text-gray-500" />;
};

const getSocialIcon = (platform: string) => {
  const iconMap = {
    instagram: <Instagram className="w-5 h-5 text-pink-500" />,
    youtube: <Youtube className="w-5 h-5 text-red-500" />,
    twitter: <Twitter className="w-5 h-5 text-blue-400" />,
    linkedin: <Linkedin className="w-5 h-5 text-blue-600" />,
    github: <Github className="w-5 h-5 text-gray-700" />,
    whatsapp: <Phone className="w-5 h-5 text-green-500" />,
    email: <Mail className="w-5 h-5 text-gray-600" />,
    website: <Globe className="w-5 h-5 text-blue-500" />,
    tiktok: <Music className="w-5 h-5 text-black" />,
    facebook: <Globe className="w-5 h-5 text-blue-600" />,
  };
  return iconMap[platform as keyof typeof iconMap] || <Globe className="w-5 h-5 text-gray-500" />;
};

const getThemeClasses = (theme: string) => {
  const themeMap = {
    default: {
      background: 'bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 min-h-screen',
      container: 'bg-white/90 backdrop-blur-sm shadow-xl',
      text: 'text-gray-900',
      textSecondary: 'text-gray-600',
      textMuted: 'text-gray-500',
      button: 'bg-white hover:bg-gray-50 border-gray-200 hover:border-purple-200 hover:shadow-md',
      badge: 'bg-purple-100 text-purple-700',
      footer: 'bg-white/50 border-gray-200'
    },
    clean: {
      background: 'bg-gray-50 min-h-screen',
      container: 'bg-white shadow-lg',
      text: 'text-gray-900',
      textSecondary: 'text-gray-700',
      textMuted: 'text-gray-500',
      button: 'bg-white hover:bg-gray-50 border-gray-300 hover:border-gray-400 hover:shadow-md',
      badge: 'bg-gray-100 text-gray-700',
      footer: 'bg-gray-100/80 border-gray-200'
    },
    dark: {
      background: 'bg-gradient-to-br from-gray-900 via-gray-800 to-black min-h-screen',
      container: 'bg-gray-800/90 backdrop-blur-sm border-gray-700 shadow-2xl',
      text: 'text-white',
      textSecondary: 'text-gray-300',
      textMuted: 'text-gray-400',
      button: 'bg-gray-700 hover:bg-gray-600 border-gray-600 hover:border-gray-500 text-white hover:shadow-lg',
      badge: 'bg-gray-700 text-gray-200',
      footer: 'bg-gray-800/50 border-gray-700'
    },
    instagram: {
      background: 'bg-gradient-to-br from-pink-400 via-red-500 to-yellow-500 min-h-screen',
      container: 'bg-white/95 backdrop-blur-sm border-white/20 shadow-2xl',
      text: 'text-gray-900',
      textSecondary: 'text-gray-700',
      textMuted: 'text-gray-600',
      button: 'bg-white/90 hover:bg-white border-white/30 hover:border-pink-200 hover:shadow-lg',
      badge: 'bg-pink-100 text-pink-700',
      footer: 'bg-white/40 border-white/20'
    }
  };
  
  return themeMap[theme as keyof typeof themeMap] || themeMap.default;
};

const LoadingSkeleton = () => (
  <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50">
    <div className="container mx-auto px-4 py-8 max-w-md">
      <div className="bg-white/90 backdrop-blur-sm shadow-xl rounded-2xl p-6 border mb-8">
        <div className="text-center">
          <Skeleton className="w-24 h-24 rounded-full mx-auto mb-4" />
          <Skeleton className="h-6 w-32 mx-auto mb-2" />
          <Skeleton className="h-4 w-24 mx-auto mb-2" />
          <Skeleton className="h-5 w-20 mx-auto" />
        </div>
      </div>
      
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-16 w-full rounded-2xl" />
        ))}
      </div>
      
      <div className="text-center mt-6 text-sm text-gray-500">
        <div className="flex items-center justify-center gap-2">
          <Wifi className="w-4 h-4 animate-pulse" />
          <span>Carregando...</span>
        </div>
      </div>
    </div>
  </div>
);

const ErrorScreen = ({ error, retry, retryCount, username }: { 
  error: string; 
  retry: () => void; 
  retryCount: number;
  username?: string;
}) => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const isConnectionError = error.includes('Timeout') || error.includes('Conexão') || !isOnline;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 flex items-center justify-center p-4">
      <div className="text-center space-y-6 max-w-md">
        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto">
          {isConnectionError ? (
            <WifiOff className="w-12 h-12 text-gray-400" />
          ) : (
            <Globe className="w-12 h-12 text-gray-400" />
          )}
        </div>
        
        <div className="space-y-2">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
            {isConnectionError ? 'Conexão Instável' : 'Página não encontrada'}
          </h1>
          <p className="text-gray-600 text-sm md:text-base">
            {isConnectionError ? (
              'Verifique sua conexão com a internet'
            ) : error.includes('não encontrado') ? (
              <>O usuário <span className="font-mono bg-gray-100 px-2 py-1 rounded text-xs md:text-sm">@{username}</span> não foi encontrado.</>
            ) : (
              error
            )}
          </p>
          
          {retryCount > 0 && (
            <p className="text-xs text-gray-500">
              Tentativa {retryCount} de 3
            </p>
          )}
          
          {!isOnline && (
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-3 mt-4">
              <p className="text-orange-700 text-sm">
                📱 Você está offline. Verifique sua conexão.
              </p>
            </div>
          )}
        </div>

        <div className="space-y-3">
          {isConnectionError && (
            <Button 
              onClick={retry}
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 w-full md:w-auto"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Tentar Novamente
            </Button>
          )}
          
          <Button asChild variant="outline" className="w-full md:w-auto">
            <a href="/">
              <ArrowRight className="w-4 h-4 mr-2" />
              {isConnectionError ? 'Voltar ao Início' : 'Criar Minha Página'}
            </a>
          </Button>
          
          {!isConnectionError && (
            <p className="text-xs md:text-sm text-gray-500">
              Crie sua página personalizada gratuitamente
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

const PublicPageOptimized = () => {
  const { username } = useParams<{ username: string }>();
  const { data, loading, error, retryCount, trackClick, retry } = usePublicPage(username || '');
  const { toast } = useToast();

  const handleLinkClick = async (link: any) => {
    try {
      await trackClick(link.id);
      
      toast({
        title: "Redirecionando...",
        description: `Abrindo ${link.title}`,
        duration: 1500,
      });
      
      // Ensure URL has protocol
      let url = link.url;
      if (!url.startsWith('http://') && !url.startsWith('https://')) {
        url = 'https://' + url;
      }
      
      window.open(url, '_blank', 'noopener,noreferrer');
    } catch (error) {
      console.error('Error tracking click:', error);
    }
  };

  const handleSocialClick = (url: string, platform: string) => {
    try {
      let socialUrl = url;
      if (!socialUrl.startsWith('http://') && !socialUrl.startsWith('https://')) {
        socialUrl = 'https://' + socialUrl;
      }
      
      window.open(socialUrl, '_blank', 'noopener,noreferrer');
    } catch (error) {
      console.error('Error opening social link:', error);
    }
  };

  if (loading) {
    return <LoadingSkeleton />;
  }

  if (error || !data) {
    return <ErrorScreen error={error || 'Erro desconhecido'} retry={retry} retryCount={retryCount} username={username} />;
  }

  const { profile, links, socialLinks } = data;
  const theme = getThemeClasses(profile.theme || 'default');
  
  const buttonColor = profile.button_color || '#8B5CF6';
  const textColor = profile.text_color || '#1F2937';

  return (
    <>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
        <meta name="theme-color" content={buttonColor} />
        <meta name="description" content={`${profile.name} - ${profile.bio || 'Página de links'}`} />
        <title>{profile.name} - LinkBio.AI</title>
        <link rel="preconnect" href="https://lrnfshwotkvbiqkquqtm.supabase.co" />
        <link rel="dns-prefetch" href="https://lrnfshwotkvbiqkquqtm.supabase.co" />
      </head>
      
      <div className={theme.background}>
        <style>
          {`
            @keyframes fadeInUp {
              from {
                opacity: 0;
                transform: translateY(20px);
              }
              to {
                opacity: 1;
                transform: translateY(0);
              }
            }
            
            .fade-in-up {
              animation: fadeInUp 0.6s ease-out forwards;
            }
            
            /* Mobile optimizations */
            @media (max-width: 768px) {
              body {
                -webkit-text-size-adjust: 100%;
                -webkit-font-smoothing: antialiased;
                -moz-osx-font-smoothing: grayscale;
              }
              
              .touch-target {
                min-height: 44px;
                min-width: 44px;
              }
              
              /* Improve tap responsiveness */
              button, a {
                -webkit-tap-highlight-color: rgba(0,0,0,0.1);
                touch-action: manipulation;
              }
            }
            
            /* Connection indicators */
            .connection-slow::after {
              content: '🐌';
              margin-left: 8px;
            }
          `}
        </style>
        
        <div className="container mx-auto px-4 py-6 md:py-8 max-w-md">
          {/* Profile Header */}
          <div className={`text-center mb-6 md:mb-8 ${theme.container} rounded-2xl p-4 md:p-6 border transition-all duration-300 fade-in-up`}>
            <Avatar className="w-20 h-20 md:w-24 md:h-24 mx-auto mb-3 md:mb-4 border-4 border-white shadow-lg">
              <AvatarImage 
                src={profile.avatar_url} 
                alt={profile.name}
                loading="eager"
                onError={(e) => {
                  console.log('Avatar failed to load:', profile.avatar_url);
                }}
              />
              <AvatarFallback className="bg-purple-100 text-purple-600 text-xl md:text-2xl font-bold">
                {profile.name.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            
            <h1 className="text-xl md:text-2xl font-bold mb-2" style={{ color: textColor }}>
              {profile.name}
            </h1>
            
            {profile.bio && (
              <div className="mb-3 whitespace-pre-line text-sm leading-relaxed px-2" style={{ color: textColor, opacity: 0.8 }}>
                {profile.bio}
              </div>
            )}
            
            <div className="flex items-center justify-center gap-2 flex-wrap">
              <Badge variant="secondary" className={`text-xs md:text-sm ${theme.badge}`}>
                @{profile.username}
              </Badge>
              {profile.is_founder && (
                <Badge variant="secondary" className="text-xs md:text-sm bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700">
                  Founder PRO
                </Badge>
              )}
            </div>
          </div>

          {/* Links Section */}
          <div className="space-y-3 md:space-y-4 mb-6 md:mb-8">
            {links.map((link, index) => (
              <button
                key={link.id}
                onClick={() => handleLinkClick(link)}
                className="w-full rounded-2xl p-3 md:p-4 shadow-sm hover:shadow-md transition-all duration-200 border group transform hover:scale-105 fade-in-up touch-target active:scale-95"
                style={{ 
                  animationDelay: `${index * 100}ms`,
                  backgroundColor: buttonColor,
                  color: textColor === '#FFFFFF' ? '#000000' : '#FFFFFF',
                  borderColor: buttonColor
                }}
              >
                <div className="flex items-center space-x-3 md:space-x-4">
                  <div className="flex-shrink-0">
                    {getIcon(link.icon)}
                  </div>
                  
                  <div className="flex-1 text-left min-w-0">
                    <p className="font-semibold text-sm md:text-base truncate">
                      {link.title}
                    </p>
                    {link.click_count > 0 && (
                      <p className="text-xs opacity-70">
                        {link.click_count} {link.click_count === 1 ? 'clique' : 'cliques'}
                      </p>
                    )}
                  </div>
                  
                  <ExternalLink className="w-4 h-4 opacity-70 flex-shrink-0" />
                </div>
              </button>
            ))}
          </div>

          {/* Social Links Section */}
          {socialLinks && socialLinks.length > 0 && (
            <div className="mb-6 md:mb-8 flex justify-center fade-in-up" style={{ animationDelay: `${links.length * 100 + 200}ms` }}>
              <div className="flex justify-center flex-wrap gap-4 md:gap-6">
                {socialLinks.map((social) => (
                  <button
                    key={social.id}
                    onClick={() => handleSocialClick(social.url, social.platform)}
                    className="transition-transform duration-200 hover:scale-110 transform touch-target active:scale-95 p-2 rounded-full hover:bg-white/10"
                    title={social.platform}
                  >
                    {getSocialIcon(social.platform)}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Footer - Only show branding if not PRO */}
          {profile.plan !== 'pro' && !profile.is_admin && (
            <div className={`text-center py-4 md:py-6 border-t rounded-2xl ${theme.footer} border transition-all duration-300 fade-in-up`} style={{ animationDelay: `${links.length * 100 + 400}ms` }}>
              <div className="flex items-center justify-center space-x-2 mb-2">
                <div className="w-6 h-6 bg-gradient-to-r from-purple-500 to-pink-500 rounded flex items-center justify-center">
                  <span className="text-white font-bold text-xs">L</span>
                </div>
                <span className={`text-sm font-semibold ${theme.text}`}>LinkBio.AI</span>
              </div>
              
              <p className={`text-xs mb-3 ${theme.textMuted}`}>
                Crie sua página personalizada gratuitamente
              </p>
              
              <Button size="sm" variant="outline" asChild className={`text-xs ${theme.button}`}>
                <a href="/">
                  Criar Minha Página
                  <ArrowRight className="w-3 h-3 ml-1" />
                </a>
              </Button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default PublicPageOptimized;

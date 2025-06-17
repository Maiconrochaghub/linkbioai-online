
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
  ArrowRight
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { usePublicPage } from "@/hooks/usePublicPage";

const getIcon = (iconName: string) => {
  const iconMap = {
    instagram: <Instagram className="w-6 h-6 text-pink-500" />,
    youtube: <Youtube className="w-6 h-6 text-red-500" />,
    twitter: <Twitter className="w-6 h-6 text-blue-400" />,
    linkedin: <Linkedin className="w-6 h-6 text-blue-600" />,
    github: <Github className="w-6 h-6 text-gray-700" />,
    whatsapp: <Phone className="w-6 h-6 text-green-500" />,
    email: <Mail className="w-6 h-6 text-gray-600" />,
    website: <Globe className="w-6 h-6 text-blue-500" />,
  };
  return iconMap[iconName as keyof typeof iconMap] || <Globe className="w-6 h-6 text-gray-500" />;
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

const PublicPage = () => {
  const { username } = useParams<{ username: string }>();
  const { data, loading, error, trackClick } = usePublicPage(username || '');
  const { toast } = useToast();

  const handleLinkClick = async (link: any) => {
    // Track click analytics
    await trackClick(link.id);
    
    // Show feedback
    toast({
      title: "Redirecionando...",
      description: `Abrindo ${link.title}`,
    });
    
    // Open link in new tab
    window.open(link.url, '_blank', 'noopener,noreferrer');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mx-auto"></div>
          <p className="text-gray-600">Carregando página...</p>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 flex items-center justify-center">
        <div className="text-center space-y-6 p-8">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto">
            <Globe className="w-12 h-12 text-gray-400" />
          </div>
          
          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-gray-900">Página não encontrada</h1>
            <p className="text-gray-600">
              O usuário <span className="font-mono bg-gray-100 px-2 py-1 rounded">@{username}</span> não foi encontrado.
            </p>
          </div>

          <div className="space-y-3">
            <Button asChild className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600">
              <a href="/">
                Criar Minha Página
                <ArrowRight className="w-4 h-4 ml-2" />
              </a>
            </Button>
            
            <p className="text-sm text-gray-500">
              Crie sua página personalizada gratuitamente
            </p>
          </div>
        </div>
      </div>
    );
  }

  const { profile, links } = data;
  const theme = getThemeClasses(profile.theme || 'default');

  return (
    <div className={theme.background}>
      <div className="container mx-auto px-4 py-8 max-w-md">
        {/* Profile Header */}
        <div className={`text-center mb-8 ${theme.container} rounded-2xl p-6 border transition-all duration-300`}>
          <Avatar className="w-24 h-24 mx-auto mb-4 border-4 border-white shadow-lg">
            <AvatarImage src={profile.avatar_url} />
            <AvatarFallback className="bg-purple-100 text-purple-600 text-2xl font-bold">
              {profile.name.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          
          <h1 className={`text-2xl font-bold mb-2 ${theme.text}`}>
            {profile.name}
          </h1>
          
          {profile.bio && (
            <div className={`mb-3 whitespace-pre-line text-sm leading-relaxed ${theme.textSecondary}`}>
              {profile.bio}
            </div>
          )}
          
          <Badge variant="secondary" className={`text-sm ${theme.badge}`}>
            @{profile.username}
          </Badge>
        </div>

        {/* Links Section */}
        <div className="space-y-4 mb-8">
          {links.map((link, index) => (
            <button
              key={link.id}
              onClick={() => handleLinkClick(link)}
              className={`w-full rounded-2xl p-4 shadow-sm hover:shadow-md transition-all duration-200 border group transform hover:scale-105 ${theme.button}`}
              style={{ 
                animationDelay: `${index * 100}ms`,
                animation: 'fadeInUp 0.6s ease-out forwards'
              }}
            >
              <div className="flex items-center space-x-4">
                <div className="flex-shrink-0">
                  {getIcon(link.icon)}
                </div>
                
                <div className="flex-1 text-left">
                  <p className={`font-semibold group-hover:text-purple-600 transition-colors ${theme.text}`}>
                    {link.title}
                  </p>
                  {link.click_count > 0 && (
                    <p className={`text-xs ${theme.textMuted}`}>
                      {link.click_count} {link.click_count === 1 ? 'clique' : 'cliques'}
                    </p>
                  )}
                </div>
                
                <ExternalLink className={`w-5 h-5 group-hover:text-purple-500 transition-colors ${theme.textMuted}`} />
              </div>
            </button>
          ))}
        </div>

        {/* Footer */}
        <div className={`text-center py-6 border-t rounded-2xl ${theme.footer} border transition-all duration-300`}>
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
      </div>
      
      <style jsx>{`
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
      `}</style>
    </div>
  );
};

export default PublicPage;

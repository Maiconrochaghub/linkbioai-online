
import { useParams } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { usePublicPage } from "@/hooks/usePublicPage";
import { LoadingSkeleton } from "@/components/public/LoadingSkeleton";
import { ErrorScreen } from "@/components/public/ErrorScreen";
import { ProfileHeader } from "@/components/public/ProfileHeader";
import { LinkButton } from "@/components/public/LinkButton";
import { SocialLinks } from "@/components/public/SocialLinks";
import { PublicPageFooter } from "@/components/public/PublicPageFooter";
import { getThemeClasses } from "@/components/public/PublicPageTheme";

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
          <ProfileHeader 
            profile={profile} 
            themeClasses={theme} 
            textColor={textColor} 
          />

          {/* Links Section */}
          <div className="space-y-3 md:space-y-4 mb-6 md:mb-8">
            {links.map((link, index) => (
              <LinkButton
                key={link.id}
                link={link}
                index={index}
                buttonColor={buttonColor}
                textColor={textColor}
                onClick={() => handleLinkClick(link)}
              />
            ))}
          </div>

          <SocialLinks 
            socialLinks={socialLinks || []} 
            linksLength={links.length}
            onSocialClick={handleSocialClick}
          />

          <PublicPageFooter 
            profile={profile} 
            themeClasses={theme} 
            linksLength={links.length}
          />
        </div>
      </div>
    </>
  );
};

export default PublicPageOptimized;

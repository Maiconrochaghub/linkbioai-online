
import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
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

interface User {
  id: string;
  name: string;
  username: string;
  avatar_url?: string;
  bio?: string;
}

interface Link {
  id: string;
  title: string;
  url: string;
  icon: string;
  position: number;
  click_count: number;
}

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

const PublicPage = () => {
  const { username } = useParams<{ username: string }>();
  const [user, setUser] = useState<User | null>(null);
  const [links, setLinks] = useState<Link[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Simulate API call to fetch user data
    const fetchUserData = async () => {
      try {
        setLoading(true);
        
        // Mock data for demonstration
        if (username === "joaosilva" || username === "demo") {
          const mockUser: User = {
            id: "1",
            name: "João Silva",
            username: username,
            avatar_url: undefined,
            bio: "Desenvolvedor Frontend & Criador de Conteúdo\n✨ Compartilhando conhecimento sobre React e JavaScript"
          };
          
          const mockLinks: Link[] = [
            {
              id: "1",
              title: "Meu Instagram",
              url: "https://instagram.com/joaosilva",
              icon: "instagram",
              position: 1,
              click_count: 127
            },
            {
              id: "2",
              title: "Canal no YouTube",
              url: "https://youtube.com/channel/joaosilva",
              icon: "youtube",
              position: 2,
              click_count: 89
            },
            {
              id: "3",
              title: "Projetos no GitHub", 
              url: "https://github.com/joaosilva",
              icon: "github",
              position: 3,
              click_count: 45
            },
            {
              id: "4",
              title: "LinkedIn Profissional",
              url: "https://linkedin.com/in/joaosilva",
              icon: "linkedin",
              position: 4,
              click_count: 32
            },
            {
              id: "5",
              title: "Meu Site Pessoal",
              url: "https://joaosilva.dev",
              icon: "website",
              position: 5,
              click_count: 78
            }
          ];
          
          setTimeout(() => {
            setUser(mockUser);
            setLinks(mockLinks.sort((a, b) => a.position - b.position));
            setLoading(false);
          }, 800);
        } else {
          setTimeout(() => {
            setNotFound(true);
            setLoading(false);
          }, 800);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        setNotFound(true);
        setLoading(false);
      }
    };

    if (username) {
      fetchUserData();
    }
  }, [username]);

  const handleLinkClick = (link: Link) => {
    // Track click analytics
    console.log(`Link clicked: ${link.title} -> ${link.url}`);
    
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

  if (notFound || !user) {
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50">
      <div className="container mx-auto px-4 py-8 max-w-md">
        {/* Profile Header */}
        <div className="text-center mb-8">
          <Avatar className="w-24 h-24 mx-auto mb-4 border-4 border-white shadow-lg">
            <AvatarImage src={user.avatar_url} />
            <AvatarFallback className="bg-purple-100 text-purple-600 text-2xl font-bold">
              {user.name.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            {user.name}
          </h1>
          
          {user.bio && (
            <div className="text-gray-600 mb-3 whitespace-pre-line text-sm leading-relaxed">
              {user.bio}
            </div>
          )}
          
          <Badge variant="secondary" className="text-sm">
            @{user.username}
          </Badge>
        </div>

        {/* Links Section */}
        <div className="space-y-4 mb-8">
          {links.map((link) => (
            <button
              key={link.id}
              onClick={() => handleLinkClick(link)}
              className="w-full bg-white rounded-2xl p-4 shadow-sm hover:shadow-md transition-all duration-200 border hover:border-purple-200 group"
            >
              <div className="flex items-center space-x-4">
                <div className="flex-shrink-0">
                  {getIcon(link.icon)}
                </div>
                
                <div className="flex-1 text-left">
                  <p className="font-semibold text-gray-900 group-hover:text-purple-600 transition-colors">
                    {link.title}
                  </p>
                </div>
                
                <ExternalLink className="w-5 h-5 text-gray-400 group-hover:text-purple-500 transition-colors" />
              </div>
            </button>
          ))}
        </div>

        {/* Footer */}
        <div className="text-center py-6 border-t border-gray-200 bg-white/50 rounded-2xl">
          <div className="flex items-center justify-center space-x-2 mb-2">
            <div className="w-6 h-6 bg-gradient-to-r from-purple-500 to-pink-500 rounded flex items-center justify-center">
              <span className="text-white font-bold text-xs">L</span>
            </div>
            <span className="text-sm font-semibold text-gray-700">LinkBio.AI</span>
          </div>
          
          <p className="text-xs text-gray-500 mb-3">
            Crie sua página personalizada gratuitamente
          </p>
          
          <Button size="sm" variant="outline" asChild className="text-xs">
            <a href="/">
              Criar Minha Página
              <ArrowRight className="w-3 h-3 ml-1" />
            </a>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PublicPage;

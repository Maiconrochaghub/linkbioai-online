
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, Eye, Instagram, Youtube, Github, Twitter, Linkedin, Globe, Phone, Mail, BarChart3 } from "lucide-react";

interface User {
  id: string;
  name: string;
  username: string;
  avatar_url?: string;
  bio?: string;
  theme?: string;
}

interface Link {
  id: string;
  title: string;
  url: string;
  icon: string;
  position: number;
  is_active: boolean;
  click_count: number;
}

interface PagePreviewProps {
  user: User;
  links: Link[];
}

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

const getThemeBackground = (theme: string) => {
  const themeMap = {
    default: 'bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50',
    clean: 'bg-gray-50',
    dark: 'bg-gradient-to-br from-gray-900 via-gray-800 to-black',
    instagram: 'bg-gradient-to-br from-pink-400 via-red-500 to-yellow-500'
  };
  return themeMap[theme as keyof typeof themeMap] || themeMap.default;
};

export function PagePreview({ user, links }: PagePreviewProps) {
  const sortedLinks = [...links].sort((a, b) => a.position - b.position);
  const totalClicks = links.reduce((sum, link) => sum + link.click_count, 0);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg flex items-center">
              <Eye className="w-5 h-5 mr-2 text-purple-600" />
              Preview da Página
            </CardTitle>
            <CardDescription>Como os visitantes veem sua página</CardDescription>
          </div>
          <Button size="sm" variant="outline" asChild>
            <a href={`/${user.username}`} target="_blank">
              <ExternalLink className="w-4 h-4 mr-2" />
              Abrir
            </a>
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {/* Mobile Preview Container */}
        <div className="bg-gray-900 rounded-2xl p-2 mx-auto shadow-2xl" style={{ width: '280px' }}>
          <div className="bg-white rounded-xl overflow-hidden" style={{ height: '500px' }}>
            <div className={`p-6 text-center h-full overflow-y-auto ${getThemeBackground(user.theme || 'default')}`}>
              {/* Profile Section */}
              <div className="mb-6">
                <Avatar className="w-20 h-20 mx-auto mb-4 border-4 border-white shadow-lg">
                  <AvatarImage src={user.avatar_url} />
                  <AvatarFallback className="bg-purple-100 text-purple-600 text-xl font-bold">
                    {user.name.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                
                <h1 className="text-xl font-bold text-gray-900 mb-2">
                  {user.name}
                </h1>
                
                {user.bio && (
                  <p className="text-sm text-gray-600 mb-2 px-2">{user.bio}</p>
                )}
                
                <Badge variant="secondary" className="text-xs">
                  @{user.username}
                </Badge>
              </div>

              {/* Links Section */}
              <div className="space-y-3">
                {sortedLinks.length === 0 ? (
                  <div className="py-8">
                    <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Globe className="w-6 h-6 text-gray-400" />
                    </div>
                    <p className="text-sm text-gray-500">
                      Adicione links para visualizar
                    </p>
                  </div>
                ) : (
                  sortedLinks.map((link) => (
                    <div
                      key={link.id}
                      className="bg-white rounded-xl p-3 shadow-sm border hover:shadow-md transition-shadow duration-200 cursor-pointer"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="flex-shrink-0">
                          {getIcon(link.icon)}
                        </div>
                        <div className="flex-1 text-left">
                          <p className="font-medium text-gray-900 text-sm truncate">
                            {link.title}
                          </p>
                          {link.click_count > 0 && (
                            <p className="text-xs text-gray-500">
                              {link.click_count} {link.click_count === 1 ? 'clique' : 'cliques'}
                            </p>
                          )}
                        </div>
                        <ExternalLink className="w-4 h-4 text-gray-400" />
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Footer */}
              <div className="mt-8 pt-4 border-t border-gray-200">
                <p className="text-xs text-gray-400">
                  Criado com LinkBio.AI
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Stats & URL Display */}
        <div className="mt-4 space-y-3">
          {totalClicks > 0 && (
            <div className="flex items-center justify-center space-x-4 p-2 bg-green-50 rounded-lg">
              <BarChart3 className="w-4 h-4 text-green-600" />
              <span className="text-sm text-green-700 font-medium">
                {totalClicks} {totalClicks === 1 ? 'clique total' : 'cliques totais'}
              </span>
            </div>
          )}
          
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-2">Sua página está em:</p>
            <div className="bg-gray-50 rounded-lg p-2">
              <code className="text-sm font-mono text-purple-600">
                linkbio.ai/{user.username}
              </code>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

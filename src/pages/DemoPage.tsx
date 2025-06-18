
import { ExternalLink, QrCode, BarChart3, Instagram, Youtube, ShoppingBag, Globe, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";

export default function DemoPage() {
  const demoLinks = [
    {
      id: 1,
      title: "Meu Site Principal",
      url: "https://exemplo.com",
      icon: "website",
      IconComponent: Globe,
      clicks: 1250
    },
    {
      id: 2,
      title: "Instagram",
      url: "https://instagram.com/exemplo",
      icon: "instagram",
      IconComponent: Instagram,
      clicks: 890
    },
    {
      id: 3,
      title: "Canal do YouTube",
      url: "https://youtube.com/exemplo",
      icon: "youtube",
      IconComponent: Youtube,
      clicks: 650
    },
    {
      id: 4,
      title: "Loja Online",
      url: "https://loja.exemplo.com",
      icon: "shopping",
      IconComponent: ShoppingBag,
      clicks: 420
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/">
              <Button variant="ghost" className="flex items-center">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Voltar
              </Button>
            </Link>
            
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">L</span>
              </div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                LinkBio.AI
              </h1>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Página de Exemplo
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Veja como fica uma página criada com o LinkBio.AI
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {/* Demo Profile */}
          <div className="order-2 lg:order-1">
            <Card className="max-w-md mx-auto shadow-2xl border-0">
              <CardContent className="p-0">
                <div className="bg-gradient-to-br from-purple-500 to-pink-500 p-8 text-center text-white rounded-t-lg">
                  <div className="w-24 h-24 bg-white/20 rounded-full mx-auto mb-4 flex items-center justify-center backdrop-blur-sm">
                    <span className="text-2xl font-bold">MC</span>
                  </div>
                  <h2 className="text-2xl font-bold mb-2">Maria Creator</h2>
                  <p className="text-purple-100">
                    Criadora de conteúdo digital • Lifestyle & Travel
                  </p>
                </div>
                
                <div className="p-6 space-y-4">
                  {demoLinks.map((link) => (
                    <div
                      key={link.id}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200 hover:border-purple-300 hover:bg-purple-50 transition-all cursor-pointer group"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow">
                          <link.IconComponent className="w-5 h-5 text-gray-600" />
                        </div>
                        <span className="font-medium text-gray-900">{link.title}</span>
                      </div>
                      <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-purple-500" />
                    </div>
                  ))}
                  
                  <div className="pt-4 border-t border-gray-200">
                    <div className="flex items-center justify-center space-x-4 text-sm text-gray-600">
                      <div className="flex items-center space-x-1">
                        <QrCode className="w-4 h-4" />
                        <span>QR Code</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <BarChart3 className="w-4 h-4" />
                        <span>3.210 visualizações</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Features Highlight */}
          <div className="order-1 lg:order-2 space-y-8">
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-6">
                O que você pode fazer:
              </h3>
              
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Globe className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Links Personalizados</h4>
                    <p className="text-gray-600">Adicione quantos links quiser e organize da forma que preferir.</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <BarChart3 className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Analytics Detalhado</h4>
                    <p className="text-gray-600">Veja quantas pessoas clicaram em cada link e de onde vieram.</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <QrCode className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">QR Code Automático</h4>
                    <p className="text-gray-600">Compartilhe sua página facilmente com um QR Code gerado automaticamente.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
              <h4 className="text-xl font-bold text-gray-900 mb-4">
                Pronto para criar a sua?
              </h4>
              <p className="text-gray-600 mb-6">
                Comece gratuitamente e tenha sua página profissional em menos de 2 minutos.
              </p>
              <div className="space-y-3">
                <Link to="/signup" className="block">
                  <Button className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600">
                    Criar Minha Página Grátis
                  </Button>
                </Link>
                <Link to="/upgrade" className="block">
                  <Button variant="outline" className="w-full">
                    Ver Planos PRO
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

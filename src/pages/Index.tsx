import { useEffect } from "react";
import { Link } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import LoginModal from "@/components/auth/LoginModal";
import SignupModal from "@/components/auth/SignupModal";
import { AppDemo } from "@/components/AppDemo";
import { Dashboard } from "@/components/dashboard/Dashboard";
import { useAuth } from "@/contexts/AuthContext";

const Index = () => {
  const { user, profile, loading } = useAuth();

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mx-auto"></div>
          <p className="text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  // Show dashboard if user is authenticated
  if (user && profile) {
    return <Dashboard />;
  }

  // Show landing page for non-authenticated users
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50">
      {/* ... keep existing code (hero section) the same ... */}
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <div className="flex items-center justify-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-2xl">L</span>
              </div>
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Todos os seus links
              <br />
              <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                em um só lugar
              </span>
            </h1>
            
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
              Crie sua página personalizada em segundos. Ideal para Instagram, TikTok e todas as suas redes sociais.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <SignupModal>
                <Button size="lg" className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-8 py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200">
                  Criar Conta Grátis
                </Button>
              </SignupModal>
              
              <LoginModal>
                <Button size="lg" variant="outline" className="px-8 py-4 text-lg font-semibold rounded-xl border-2 hover:border-purple-300 hover:bg-purple-50 transition-all duration-200">
                  Já tenho conta
                </Button>
              </LoginModal>
            </div>
            
            <p className="text-sm text-gray-500">
              ✨ Grátis para sempre • 🚀 Setup em 60 segundos • 📱 Mobile-first
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <div className="text-center p-6 bg-white/60 backdrop-blur-sm rounded-2xl border border-white/20 shadow-sm">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">⚡</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Setup Rápido</h3>
              <p className="text-gray-600">Configure tudo em menos de 60 segundos. Zero complicação.</p>
            </div>
            
            <div className="text-center p-6 bg-white/60 backdrop-blur-sm rounded-2xl border border-white/20 shadow-sm">
              <div className="w-12 h-12 bg-pink-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🎨</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Design Familiar</h3>
              <p className="text-gray-600">Interface inspirada no Instagram que seus seguidores já conhecem.</p>
            </div>
            
            <div className="text-center p-6 bg-white/60 backdrop-blur-sm rounded-2xl border border-white/20 shadow-sm">
              <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">📊</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Analytics Simples</h3>
              <p className="text-gray-600">Veja quantas pessoas clicaram em seus links. Dados claros e úteis.</p>
            </div>
          </div>

          {/* Demo Section */}
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Veja como fica</h2>
            <p className="text-gray-600 mb-8">Exemplo de uma página criada com LinkBio.AI</p>
            
            <div className="max-w-sm mx-auto">
              <div className="bg-gray-900 rounded-2xl p-2">
                <div className="bg-white rounded-xl overflow-hidden" style={{ height: '600px' }}>
                  <div className="p-6 text-center bg-gradient-to-br from-purple-50 to-pink-50 h-full overflow-y-auto">
                    <Avatar className="w-20 h-20 mx-auto mb-4 border-4 border-white shadow-lg">
                      <AvatarFallback className="bg-purple-100 text-purple-600 text-xl font-bold">
                        J
                      </AvatarFallback>
                    </Avatar>
                    
                    <h1 className="text-xl font-bold text-gray-900 mb-2">João Silva</h1>
                    <p className="text-sm text-gray-600 mb-2">Desenvolvedor Frontend & Criador de Conteúdo</p>
                    <Badge variant="secondary" className="text-xs mb-6">@joaosilva</Badge>
                    
                    <div className="space-y-3">
                      {[
                        { title: "Meu Instagram", icon: "📱", color: "border-pink-200" },
                        { title: "Canal YouTube", icon: "📺", color: "border-red-200" },
                        { title: "GitHub", icon: "👨‍💻", color: "border-gray-200" },
                        { title: "LinkedIn", icon: "💼", color: "border-blue-200" }
                      ].map((item, index) => (
                        <div key={index} className={`bg-white rounded-xl p-3 shadow-sm border ${item.color} hover:shadow-md transition-shadow cursor-pointer`}>
                          <div className="flex items-center space-x-3">
                            <span className="text-xl">{item.icon}</span>
                            <span className="font-medium text-gray-900 text-sm">{item.title}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    <div className="mt-8 pt-4 border-t border-gray-200">
                      <p className="text-xs text-gray-400">Criado com LinkBio.AI</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* CTA Section */}
          <div className="text-center bg-white/60 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Pronto para começar?
            </h2>
            <p className="text-gray-600 mb-6">
              Junte-se a milhares de criadores que já usam LinkBio.AI
            </p>
            
            <SignupModal>
              <Button size="lg" className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-8 py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200">
                Começar Agora - É Grátis!
              </Button>
            </SignupModal>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;

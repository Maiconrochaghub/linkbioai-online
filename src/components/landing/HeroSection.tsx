
import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export function HeroSection() {
  return (
    <section className="relative py-20 md:py-32 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50" />
      <div className="relative container mx-auto px-4">
        <div className="text-center max-w-4xl mx-auto">
          <div className="inline-flex items-center px-4 py-2 bg-purple-100 rounded-full text-purple-700 text-sm font-medium mb-8">
            <Sparkles className="w-4 h-4 mr-2" />
            Crie sua página profissional em 60 segundos
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6 leading-tight">
            Todos os seus links
            <span className="block bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              em um só lugar
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-600 mb-10 max-w-3xl mx-auto leading-relaxed">
            Conecte todas as suas redes, produtos e canais em uma página única e profissional. 
            Ideal para criadores, empresas e influenciadores.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link to="/signup">
              <Button size="lg" className="w-full sm:w-auto bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold px-8 py-4 text-lg">
                Criar Conta Grátis
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
            
            <Link to="/demo" target="_blank" rel="noopener noreferrer">
              <Button size="lg" variant="outline" className="w-full sm:w-auto border-gray-300 text-gray-700 hover:bg-gray-50 px-8 py-4 text-lg">
                Ver Página de Exemplo
              </Button>
            </Link>
          </div>

          {/* Mockup illustration placeholder */}
          <div className="relative mx-auto max-w-2xl">
            <div className="bg-white rounded-3xl shadow-2xl p-8 border border-gray-200">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <span className="text-white font-bold text-lg">L</span>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">@seunome</h3>
                <p className="text-gray-600 text-sm mb-6">Criador de conteúdo digital</p>
                <div className="space-y-3">
                  <div className="bg-gray-100 rounded-lg p-3 text-sm">🔗 Meu Site Principal</div>
                  <div className="bg-gray-100 rounded-lg p-3 text-sm">📱 Instagram</div>
                  <div className="bg-gray-100 rounded-lg p-3 text-sm">🛒 Loja Online</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}


import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { HeroSection } from "@/components/landing/HeroSection";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { BenefitsSection } from "@/components/landing/BenefitsSection";
import { PricingSection } from "@/components/landing/PricingSection";
import { TestimonialsSection } from "@/components/landing/TestimonialsSection";
import { SecuritySection } from "@/components/landing/SecuritySection";
import { CallToActionSection } from "@/components/landing/CallToActionSection";

export default function Index() {
  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="container mx-auto px-4 py-6 relative z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">L</span>
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              LinkBio.AI
            </h1>
          </div>
          
          <div className="flex items-center space-x-4">
            <Link to="/login">
              <Button variant="ghost" className="text-gray-600 hover:text-gray-900">
                Entrar
              </Button>
            </Link>
            <Link to="/signup">
              <Button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white">
                Criar Conta
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main>
        <HeroSection />
        <HowItWorks />
        <BenefitsSection />
        <PricingSection />
        <TestimonialsSection />
        <SecuritySection />
        <CallToActionSection />
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-6 h-6 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-xs">L</span>
                </div>
                <span className="text-lg font-semibold">LinkBio.AI</span>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed">
                A maneira mais fácil de conectar todas as suas redes sociais e canais em um só lugar.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Produto</h4>
              <div className="space-y-2 text-sm">
                <Link to="/signup" className="block text-gray-400 hover:text-white">Criar Conta</Link>
                <Link to="/upgrade" className="block text-gray-400 hover:text-white">Planos</Link>
                <Link to="/demo" className="block text-gray-400 hover:text-white">Demo</Link>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Recursos</h4>
              <div className="space-y-2 text-sm">
                <a href="#" className="block text-gray-400 hover:text-white">Temas</a>
                <a href="#" className="block text-gray-400 hover:text-white">Analytics</a>
                <a href="#" className="block text-gray-400 hover:text-white">QR Code</a>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Suporte</h4>
              <div className="space-y-2 text-sm">
                <a href="#" className="block text-gray-400 hover:text-white">Central de Ajuda</a>
                <a href="#" className="block text-gray-400 hover:text-white">Contato</a>
                <a href="#" className="block text-gray-400 hover:text-white">Termos de Uso</a>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-800 pt-8 text-center text-gray-400 text-sm">
            <p>© 2024 LinkBio.AI. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

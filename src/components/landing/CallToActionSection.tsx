import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
export function CallToActionSection() {
  return <section className="py-20 bg-gradient-to-r from-purple-500 to-pink-500 relative overflow-hidden">
      <div className="absolute inset-0 bg-black/10" />
      <div className="relative container mx-auto px-4 text-center">
        <div className="max-w-4xl mx-auto">
          <div className="inline-flex items-center px-4 py-2 bg-white/20 rounded-full text-white text-sm font-medium mb-8">
            <Sparkles className="w-4 h-4 mr-2" />
            Junte-se a milhares de criadores de sucesso
          </div>
          
          <h2 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
            Pronto para começar?
          </h2>
          
          <p className="text-xl md:text-2xl text-purple-100 mb-10 max-w-2xl mx-auto leading-relaxed">
            Crie sua página profissional agora mesmo. É grátis e leva menos de 1 minuto!
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/signup">
              <Button size="lg" variant="secondary" className="w-full sm:w-auto bg-white text-purple-600 hover:bg-gray-50 font-bold px-8 py-4 text-lg shadow-lg">
                Criar Minha Página Agora
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
            
            <Link to="/upgrade">
              <Button size="lg" variant="outline" className="w-full sm:w-auto border-white px-8 py-4 text-lg bg-fuchsia-100 text-purple-700">
                Ver Plano PRO
              </Button>
            </Link>
          </div>

          <p className="text-purple-100 text-sm mt-8">
            Sem cartão de crédito • Sem compromisso • Cancele quando quiser
          </p>
        </div>
      </div>
    </section>;
}
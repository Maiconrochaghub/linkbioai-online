
import { Check, Crown, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";

export function PricingSection() {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Escolha seu plano
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Comece grátis e faça upgrade quando precisar de mais recursos
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Free Plan */}
          <div className="bg-white rounded-3xl p-8 border-2 border-gray-200 shadow-lg">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Gratuito</h3>
              <p className="text-gray-600 mb-4">Para começar</p>
              <div className="text-5xl font-bold text-gray-900 mb-2">$0</div>
              <p className="text-gray-600">para sempre</p>
            </div>

            <div className="space-y-4 mb-8">
              <div className="flex items-center">
                <Check className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                <span>Até 5 links ativos</span>
              </div>
              <div className="flex items-center">
                <Check className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                <span>1 tema padrão</span>
              </div>
              <div className="flex items-center">
                <Check className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                <span>QR Code gratuito</span>
              </div>
              <div className="flex items-center">
                <Check className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                <span>Analytics básico</span>
              </div>
              <div className="flex items-center">
                <Check className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                <span>Branding LinkBio.AI</span>
              </div>
            </div>

            <Link to="/signup" className="block">
              <Button className="w-full" variant="outline">
                Começar Grátis
              </Button>
            </Link>
          </div>

          {/* PRO Plan */}
          <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-3xl p-8 border-2 border-purple-300 shadow-2xl relative">
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
              <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-2">
                🔥 OFERTA FUNDADOR
              </Badge>
            </div>

            <div className="text-center mb-8 pt-4">
              <h3 className="text-2xl font-bold text-gray-900 mb-2 flex items-center justify-center">
                <Crown className="w-6 h-6 text-yellow-500 mr-2" />
                Fundador PRO
              </h3>
              <p className="text-gray-600 mb-4">Apenas para os primeiros 10.000</p>
              <div className="text-5xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
                $1
              </div>
              <p className="text-gray-600">por mês</p>
              <p className="text-sm text-gray-500 line-through">Era $19/mês</p>
            </div>

            <div className="space-y-4 mb-8">
              <div className="flex items-center">
                <Star className="w-5 h-5 text-purple-500 mr-3 flex-shrink-0" />
                <span className="font-medium">Links ilimitados</span>
              </div>
              <div className="flex items-center">
                <Star className="w-5 h-5 text-purple-500 mr-3 flex-shrink-0" />
                <span className="font-medium">4 temas exclusivos</span>
              </div>
              <div className="flex items-center">
                <Star className="w-5 h-5 text-purple-500 mr-3 flex-shrink-0" />
                <span className="font-medium">Analytics avançado</span>
              </div>
              <div className="flex items-center">
                <Star className="w-5 h-5 text-purple-500 mr-3 flex-shrink-0" />
                <span className="font-medium">Agendamento de links</span>
              </div>
              <div className="flex items-center">
                <Star className="w-5 h-5 text-purple-500 mr-3 flex-shrink-0" />
                <span className="font-medium">Remove branding</span>
              </div>
              <div className="flex items-center">
                <Crown className="w-5 h-5 text-yellow-500 mr-3 flex-shrink-0" />
                <span className="font-medium">Badge Fundador exclusivo</span>
              </div>
              <div className="flex items-center">
                <Crown className="w-5 h-5 text-yellow-500 mr-3 flex-shrink-0" />
                <span className="font-medium">Preço congelado para sempre</span>
              </div>
            </div>

            <Link to="/upgrade" className="block">
              <Button className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold">
                <Crown className="w-5 h-5 mr-2" />
                Ser Fundador PRO
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

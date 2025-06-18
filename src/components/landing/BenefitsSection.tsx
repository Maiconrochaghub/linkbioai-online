
import { Users, ShoppingBag, TrendingUp, Palette, BarChart3, Smartphone } from "lucide-react";

export function BenefitsSection() {
  const benefits = [
    {
      icon: Users,
      title: "Ideal para Criadores",
      description: "Influenciadores, YouTubers, podcasters e criadores de conteúdo que precisam centralizar seus canais.",
      color: "from-blue-500 to-cyan-500"
    },
    {
      icon: ShoppingBag,
      title: "Perfeito para Negócios",
      description: "Empresas, lojas online e empreendedores que querem direcionar tráfego para múltiplos canais de venda.",
      color: "from-green-500 to-emerald-500"
    },
    {
      icon: TrendingUp,
      title: "Impulsione seu Tráfego",
      description: "Aumente conversões direcionando seu público para os lugares certos no momento certo.",
      color: "from-purple-500 to-pink-500"
    }
  ];

  const features = [
    {
      icon: Palette,
      title: "Totalmente Personalizável",
      description: "Escolha entre diversos temas e personalize cores para combinar com sua marca."
    },
    {
      icon: BarChart3,
      title: "Analytics Detalhado",
      description: "Acompanhe cliques, visitantes e performance de cada link em tempo real."
    },
    {
      icon: Smartphone,
      title: "100% Responsivo",
      description: "Sua página fica perfeita em qualquer dispositivo - celular, tablet ou desktop."
    }
  ];

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        {/* Audiences */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Para quem é o LinkBio.AI?
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Nossa plataforma foi pensada para diferentes tipos de usuários
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-20">
          {benefits.map((benefit, index) => (
            <div key={index} className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
              <div className={`w-16 h-16 bg-gradient-to-r ${benefit.color} rounded-2xl flex items-center justify-center mb-6`}>
                <benefit.icon className="w-8 h-8 text-white" />
              </div>
              
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                {benefit.title}
              </h3>
              
              <p className="text-gray-600 leading-relaxed">
                {benefit.description}
              </p>
            </div>
          ))}
        </div>

        {/* Features */}
        <div className="text-center mb-12">
          <h3 className="text-3xl font-bold text-gray-900 mb-4">
            Recursos que fazem a diferença
          </h3>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {features.map((feature, index) => (
            <div key={index} className="text-center p-6">
              <div className="w-14 h-14 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <feature.icon className="w-7 h-7 text-purple-600" />
              </div>
              
              <h4 className="text-xl font-semibold text-gray-900 mb-3">
                {feature.title}
              </h4>
              
              <p className="text-gray-600">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

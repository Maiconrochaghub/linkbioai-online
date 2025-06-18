
import { UserPlus, Link2, Share2 } from "lucide-react";

export function HowItWorks() {
  const steps = [
    {
      icon: UserPlus,
      title: "1. Cadastre-se",
      description: "Crie sua conta gratuitamente em segundos. Não precisa de cartão de crédito."
    },
    {
      icon: Link2,
      title: "2. Adicione seus links",
      description: "Conecte suas redes sociais, site, loja online e tudo que é importante."
    },
    {
      icon: Share2,
      title: "3. Compartilhe",
      description: "Use sua página em bio do Instagram, TikTok ou onde quiser direcionar seu público."
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Como funciona
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Em apenas 3 passos simples, você tem sua página profissional pronta
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {steps.map((step, index) => (
            <div key={index} className="text-center relative">
              <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <step.icon className="w-10 h-10 text-white" />
              </div>
              
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                {step.title}
              </h3>
              
              <p className="text-gray-600 leading-relaxed">
                {step.description}
              </p>

              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-10 left-full w-full">
                  <div className="w-full h-0.5 bg-gradient-to-r from-purple-200 to-pink-200 relative">
                    <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-0 h-0 border-l-8 border-l-purple-300 border-t-4 border-t-transparent border-b-4 border-b-transparent"></div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}


import { Shield, CheckCircle, Lock, CreditCard } from "lucide-react";

export function SecuritySection() {
  const features = [
    {
      icon: Shield,
      title: "Pagamento Seguro",
      description: "Processamento via Stripe, usado por milhões de empresas mundialmente"
    },
    {
      icon: CheckCircle,
      title: "Cancelamento Livre",
      description: "Cancele a qualquer momento sem multas ou taxas de cancelamento"
    },
    {
      icon: Lock,
      title: "Dados Protegidos",
      description: "Seus dados pessoais e de pagamento são criptografados e seguros"
    },
    {
      icon: CreditCard,
      title: "Sem Taxas Ocultas",
      description: "Preço transparente, sem surpresas na sua fatura mensal"
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Segurança e Confiança
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Sua tranquilidade é nossa prioridade. Veja por que você pode confiar no LinkBio.AI
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
          {features.map((feature, index) => (
            <div key={index} className="text-center p-6 bg-gray-50 rounded-2xl">
              <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <feature.icon className="w-8 h-8 text-green-600" />
              </div>
              
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                {feature.title}
              </h3>
              
              <p className="text-gray-600 text-sm leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <div className="inline-flex items-center space-x-4 bg-green-50 rounded-2xl px-8 py-4 border border-green-200">
            <Shield className="w-8 h-8 text-green-600" />
            <div className="text-left">
              <div className="font-semibold text-green-800">Stripe Secure Payment</div>
              <div className="text-green-700 text-sm">Certificado PCI DSS Level 1</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

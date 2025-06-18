
import { Star, Quote } from "lucide-react";

export function TestimonialsSection() {
  const testimonials = [
    {
      name: "Maria Silva",
      role: "Influenciadora Digital",
      avatar: "MS",
      rating: 5,
      text: "O LinkBio.AI mudou completamente como eu direciono meu público. Agora tenho tudo organizado em um só lugar!"
    },
    {
      name: "João Santos",
      role: "Empreendedor",
      avatar: "JS",
      rating: 5,
      text: "Perfeito para minha loja online. Consegui aumentar as vendas direcionando melhor o tráfego das redes sociais."
    },
    {
      name: "Ana Costa",
      role: "Content Creator",
      avatar: "AC",
      rating: 5,
      text: "Interface super intuitiva e o plano PRO vale cada centavo. As estatísticas me ajudam muito!"
    }
  ];

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            O que nossos usuários dizem
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
            Mais de 3.200 usuários já confiam no LinkBio.AI para gerenciar seus links
          </p>
          
          <div className="inline-flex items-center space-x-2 bg-white rounded-full px-6 py-3 shadow-lg border">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
              ))}
            </div>
            <span className="font-semibold text-gray-900">4.9/5</span>
            <span className="text-gray-600">baseado em 1.200+ avaliações</span>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 relative">
              <Quote className="w-8 h-8 text-purple-200 mb-4" />
              
              <div className="flex mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                ))}
              </div>
              
              <p className="text-gray-700 mb-6 leading-relaxed">
                "{testimonial.text}"
              </p>
              
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold mr-4">
                  {testimonial.avatar}
                </div>
                <div>
                  <div className="font-semibold text-gray-900">{testimonial.name}</div>
                  <div className="text-gray-600 text-sm">{testimonial.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

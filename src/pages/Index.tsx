
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Instagram, Youtube, Github, Twitter, Linkedin, Globe, ArrowRight, CheckCircle, Users, TrendingUp, Smartphone } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !name) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, preencha todos os campos.",
        variant: "destructive"
      });
      return;
    }
    
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      toast({
        title: "Conta criada com sucesso!",
        description: "Verifique seu email para confirmar a conta.",
      });
      setIsLoading(false);
    }, 2000);
  };

  const features = [
    {
      icon: <Smartphone className="w-6 h-6" />,
      title: "Mobile First",
      description: "Perfeito em qualquer dispositivo"
    },
    {
      icon: <TrendingUp className="w-6 h-6" />,
      title: "Analytics",
      description: "Acompanhe cliques e performance"
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "Fácil de Usar",
      description: "Configure em menos de 2 minutos"
    }
  ];

  const socialIcons = [
    { icon: <Instagram className="w-8 h-8" />, name: "Instagram", color: "text-pink-500" },
    { icon: <Youtube className="w-8 h-8" />, name: "YouTube", color: "text-red-500" },
    { icon: <Twitter className="w-8 h-8" />, name: "Twitter", color: "text-blue-400" },
    { icon: <Linkedin className="w-8 h-8" />, name: "LinkedIn", color: "text-blue-600" },
    { icon: <Github className="w-8 h-8" />, name: "GitHub", color: "text-gray-700" },
    { icon: <Globe className="w-8 h-8" />, name: "Website", color: "text-green-500" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <nav className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">L</span>
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              LinkBio.AI
            </span>
          </div>
          <Button variant="outline" className="hover:bg-purple-50">
            Entrar
          </Button>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <Badge variant="secondary" className="mb-4 bg-purple-100 text-purple-700">
          🚀 Novo: Agora com Analytics Avançados
        </Badge>
        
        <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 bg-clip-text text-transparent leading-tight">
          Todos os seus links
          <br />
          em um só lugar
        </h1>
        
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          Crie sua página personalizada em segundos. Ideal para Instagram, TikTok e todas as suas redes sociais.
        </p>

        {/* Signup Form */}
        <Card className="max-w-md mx-auto mb-12 shadow-xl border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-2xl">Comece Gratuitamente</CardTitle>
            <CardDescription>Sem cartão de crédito necessário</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSignup} className="space-y-4">
              <Input
                type="text"
                placeholder="Seu nome completo"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="h-12"
              />
              <Input
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-12"
              />
              <Button 
                type="submit" 
                className="w-full h-12 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold"
                disabled={isLoading}
              >
                {isLoading ? "Criando conta..." : "Criar Conta Grátis"}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Social Icons Preview */}
        <div className="flex justify-center items-center space-x-4 mb-8">
          <span className="text-gray-500 text-sm">Conecte todas as suas redes:</span>
        </div>
        <div className="flex justify-center flex-wrap gap-4 mb-16">
          {socialIcons.map((social, index) => (
            <div key={index} className={`${social.color} hover:scale-110 transition-transform duration-200 cursor-pointer`}>
              {social.icon}
            </div>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">Por que escolher o LinkBio.AI?</h2>
          <p className="text-gray-600 text-lg">Tudo que você precisa para gerenciar seus links</p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {features.map((feature, index) => (
            <Card key={index} className="text-center hover:shadow-lg transition-shadow duration-300 border-0 bg-white/80 backdrop-blur-sm">
              <CardContent className="pt-6">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white mb-4 mx-auto">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Benefits */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 mb-16">
          <h3 className="text-2xl font-bold text-center mb-8">Tudo incluído gratuitamente</h3>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              "Até 20 links por perfil",
              "Página personalizada responsiva",
              "Analytics de cliques em tempo real",
              "Detecção automática de ícones",
              "Username personalizado",
              "Carregamento ultra-rápido"
            ].map((benefit, index) => (
              <div key={index} className="flex items-center space-x-3">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span className="text-gray-700">{benefit}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl p-12 text-white">
          <h2 className="text-4xl font-bold mb-4">Pronto para começar?</h2>
          <p className="text-xl mb-8 opacity-90">
            Junte-se a milhares de criadores que já usam o LinkBio.AI
          </p>
          <Button size="lg" variant="secondary" className="bg-white text-purple-600 hover:bg-gray-100 h-12 px-8 font-semibold">
            Criar Minha Página Agora
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-8 text-center text-gray-600">
        <div className="flex items-center justify-center space-x-2 mb-4">
          <div className="w-6 h-6 bg-gradient-to-r from-purple-500 to-pink-500 rounded flex items-center justify-center">
            <span className="text-white font-bold text-xs">L</span>
          </div>
          <span className="font-semibold">LinkBio.AI</span>
        </div>
        <p>&copy; 2025 LinkBio.AI. Todos os direitos reservados.</p>
      </footer>
    </div>
  );
};

export default Index;

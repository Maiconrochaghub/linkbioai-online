
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Check, 
  Star, 
  Zap, 
  Shield, 
  Palette, 
  BarChart3,
  Clock,
  Crown,
  Users,
  ArrowLeft,
  Loader2,
  X,
  TrendingUp,
  Heart,
  Sparkles,
  Timer
} from "lucide-react";
import { usePlan } from "@/hooks/usePlan";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

const UpgradePage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const { isPro, isFounder, canUpgrade, founderCount, createCheckoutSession, loading } = usePlan();
  const [upgrading, setUpgrading] = useState(false);
  const [timeLeft, setTimeLeft] = useState("");

  // Countdown timer for urgency
  useEffect(() => {
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + 7); // 7 days from now
    
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = targetDate.getTime() - now;
      
      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      
      setTimeLeft(`${days}d ${hours}h ${minutes}m`);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleUpgrade = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    if (!canUpgrade) {
      toast({
        title: "🔥 Oferta Fundador Encerrada",
        description: "Atingimos o limite de 10.000 fundadores. O plano PRO regular estará disponível em breve.",
        variant: "destructive"
      });
      return;
    }

    setUpgrading(true);
    try {
      await createCheckoutSession();
      toast({
        title: "🚀 Redirecionando para pagamento...",
        description: "Você será redirecionado para o checkout seguro do Stripe.",
      });
    } catch (error) {
      console.error('Error during upgrade:', error);
      toast({
        title: "❌ Erro no checkout",
        description: "Ocorreu um erro ao iniciar o processo. Tente novamente.",
        variant: "destructive"
      });
    } finally {
      setUpgrading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-16 h-16 text-purple-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Carregando informações do plano...</p>
        </div>
      </div>
    );
  }

  const progressPercentage = Math.min((founderCount / 10000) * 100, 100);
  const remainingFounders = Math.max(10000 - founderCount, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Button variant="ghost" onClick={() => navigate('/dashboard')} className="flex items-center">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar ao Dashboard
            </Button>
            
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">L</span>
              </div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                LinkBio.AI
              </h1>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Already Pro Message */}
        {isPro && (
          <div className="max-w-2xl mx-auto mb-8">
            <Card className="border-green-200 bg-gradient-to-r from-green-50 to-emerald-50 shadow-xl">
              <CardContent className="text-center py-8">
                <div className="flex items-center justify-center mb-4">
                  <div className="relative">
                    <Shield className="w-20 h-20 text-green-600" />
                    {isFounder && <Crown className="w-8 h-8 text-yellow-500 absolute -top-2 -right-2" />}
                  </div>
                </div>
                <h2 className="text-3xl font-bold text-green-800 mb-2">
                  🎉 Você já é {isFounder ? 'Fundador ' : ''}PRO!
                </h2>
                <p className="text-green-700 mb-4 text-lg">
                  Aproveite todos os recursos ilimitados do LinkBio.AI
                </p>
                {isFounder && (
                  <Badge className="mb-4 bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-4 py-2">
                    <Crown className="w-4 h-4 mr-2" />
                    Fundador #{founderCount.toLocaleString()}
                  </Badge>
                )}
                <Button onClick={() => navigate('/dashboard')} size="lg" className="bg-green-600 hover:bg-green-700">
                  <Sparkles className="w-5 h-5 mr-2" />
                  Ir para o Dashboard
                </Button>
              </CardContent>
            </Card>
          </div>
        )}

        {!isPro && (
          <>
            {/* Hero Section */}
            <div className="text-center mb-12 max-w-4xl mx-auto">
              <div className="mb-6">
                <Badge className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-4 py-2 mb-4 animate-pulse">
                  <Timer className="w-4 h-4 mr-2" />
                  Oferta por tempo limitado: {timeLeft}
                </Badge>
                
                <h1 className="text-5xl md:text-6xl font-bold mb-4">
                  <span className="bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 bg-clip-text text-transparent">
                    Desbloqueie o Poder do
                  </span>
                  <br />
                  <span className="text-gray-900">LinkBio PRO</span>
                </h1>
                
                <p className="text-xl md:text-2xl text-gray-600 mb-6 max-w-3xl mx-auto">
                  Seja um dos <span className="font-bold text-purple-600">{remainingFounders.toLocaleString()} fundadores restantes</span> e garante recursos ilimitados por apenas <span className="font-bold text-green-600">$1/mês</span>
                </p>

                {/* Progress Bar */}
                <div className="bg-white rounded-full p-2 shadow-lg border max-w-md mx-auto mb-6">
                  <div className="flex items-center justify-between mb-2 px-2">
                    <span className="text-sm font-medium text-gray-600">Fundadores cadastrados</span>
                    <span className="text-sm font-bold text-purple-600">{founderCount.toLocaleString()}/10.000</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
                    <div 
                      className="h-4 bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 rounded-full transition-all duration-700 ease-out relative"
                      style={{ width: `${progressPercentage}%` }}
                    >
                      <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
                    </div>
                  </div>
                </div>

                {canUpgrade ? (
                  <Button 
                    onClick={handleUpgrade} 
                    disabled={upgrading}
                    size="lg"
                    className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-4 px-8 text-xl shadow-2xl transform hover:scale-105 transition-all duration-200"
                  >
                    {upgrading ? (
                      <>
                        <Loader2 className="w-6 h-6 mr-3 animate-spin" />
                        Processando...
                      </>
                    ) : (
                      <>
                        <Crown className="w-6 h-6 mr-3" />
                        Quero ser Fundador PRO - $1/mês
                        <Sparkles className="w-6 h-6 ml-3" />
                      </>
                    )}
                  </Button>
                ) : (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
                    <p className="text-red-700 font-bold text-lg mb-2">🔥 Oferta Fundador Encerrada</p>
                    <p className="text-red-600">Atingimos 10.000 fundadores. O plano PRO regular estará disponível em breve.</p>
                  </div>
                )}
              </div>
            </div>

            {/* Social Proof */}
            <div className="text-center mb-12 bg-white rounded-2xl p-8 shadow-xl max-w-4xl mx-auto border">
              <h2 className="text-3xl font-bold mb-4 text-gray-900">
                <Heart className="w-8 h-8 text-red-500 inline mr-2" />
                Junte-se aos Fundadores do Futuro
              </h2>
              <p className="text-xl text-gray-600 mb-6">
                Mais de <span className="font-bold text-purple-600">{Math.floor(founderCount / 100) * 100}+ criadores</span> já garantiram seu lugar nessa revolução digital.
              </p>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center">
                  <TrendingUp className="w-12 h-12 text-green-500 mx-auto mb-2" />
                  <h3 className="font-bold text-lg">Crescimento Real</h3>
                  <p className="text-gray-600">+300% engagement médio</p>
                </div>
                <div className="text-center">
                  <Users className="w-12 h-12 text-blue-500 mx-auto mb-2" />
                  <h3 className="font-bold text-lg">Comunidade Ativa</h3>
                  <p className="text-gray-600">Suporte prioritário</p>
                </div>
                <div className="text-center">
                  <Star className="w-12 h-12 text-yellow-500 mx-auto mb-2" />
                  <h3 className="font-bold text-lg">Satisfação</h3>
                  <p className="text-gray-600">98% recomendam</p>
                </div>
              </div>
            </div>

            {/* Plan Comparison */}
            <div className="max-w-6xl mx-auto mb-12">
              <h2 className="text-4xl font-bold text-center mb-8 text-gray-900">
                Compare os Planos
              </h2>
              
              <div className="grid md:grid-cols-2 gap-8">
                {/* Free Plan */}
                <Card className="relative bg-white shadow-lg">
                  <CardHeader className="text-center">
                    <CardTitle className="text-2xl text-gray-700">Plano Gratuito</CardTitle>
                    <CardDescription>Para começar</CardDescription>
                    <div className="text-center py-4">
                      <span className="text-4xl font-bold text-gray-700">$0</span>
                      <span className="text-gray-500">/mês</span>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <div className="flex items-center space-x-3">
                        <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                        <span>Até 5 links ativos</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                        <span>1 tema (Padrão)</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                        <span>Analytics básico</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                        <span>QR Code</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <X className="w-5 h-5 text-red-500 flex-shrink-0" />
                        <span className="text-gray-400">Agendamento de links</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <X className="w-5 h-5 text-red-500 flex-shrink-0" />
                        <span className="text-gray-400">Remoção de branding</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <X className="w-5 h-5 text-red-500 flex-shrink-0" />
                        <span className="text-gray-400">Badge Fundador</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Founder PRO Plan */}
                <Card className="relative border-4 border-gradient-to-r from-purple-500 to-pink-500 shadow-2xl transform scale-105 bg-gradient-to-br from-purple-50 to-pink-50">
                  <div className="absolute -top-6 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-6 py-2 text-lg font-bold animate-bounce">
                      🔥 OFERTA FUNDADOR
                    </Badge>
                  </div>
                  
                  <CardHeader className="pt-8 text-center">
                    <CardTitle className="text-3xl flex items-center justify-center text-purple-700">
                      <Crown className="w-8 h-8 text-yellow-500 mr-3" />
                      Fundador PRO 
                    </CardTitle>
                    <CardDescription className="text-lg font-medium">
                      Recursos ilimitados por vida
                    </CardDescription>
                    <div className="text-center py-4">
                      <div className="text-6xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                        $1
                      </div>
                      <span className="text-gray-600 text-xl">/mês</span>
                      <div className="text-lg text-red-500 line-through font-medium">
                        Era $19/mês
                      </div>
                      <div className="text-sm text-green-600 font-bold">
                        Economia de 95%!
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <div className="flex items-center space-x-3">
                        <Zap className="w-5 h-5 text-purple-500 flex-shrink-0" />
                        <span className="font-medium">Links ilimitados</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Palette className="w-5 h-5 text-purple-500 flex-shrink-0" />
                        <span className="font-medium">4 temas exclusivos</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <BarChart3 className="w-5 h-5 text-purple-500 flex-shrink-0" />
                        <span className="font-medium">Analytics avançado</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Clock className="w-5 h-5 text-purple-500 flex-shrink-0" />
                        <span className="font-medium">Agendamento de links</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Shield className="w-5 h-5 text-purple-500 flex-shrink-0" />
                        <span className="font-medium">Remove branding LinkBio</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Star className="w-5 h-5 text-yellow-500 flex-shrink-0" />
                        <span className="font-medium">Badge Fundador exclusivo</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Crown className="w-5 h-5 text-yellow-500 flex-shrink-0" />
                        <span className="font-medium">Preço vitalício congelado</span>
                      </div>
                    </div>

                    {canUpgrade && (
                      <Button
                        onClick={handleUpgrade}
                        disabled={upgrading}
                        className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold py-4 text-lg shadow-xl transform hover:scale-105 transition-all duration-200"
                      >
                        {upgrading ? (
                          <>
                            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                            Processando...
                          </>
                        ) : (
                          <>
                            <Crown className="w-5 h-5 mr-2" />
                            Garantir por $1/mês
                            <Sparkles className="w-5 h-5 ml-2" />
                          </>
                        )}
                      </Button>
                    )}

                    {canUpgrade && (
                      <p className="text-xs text-center text-gray-600">
                        💳 Pagamento 100% seguro via Stripe • Cancele quando quiser
                      </p>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Security Section */}
            <div className="max-w-4xl mx-auto mb-12">
              <Card className="bg-gradient-to-r from-green-50 to-blue-50 border-green-200 shadow-xl">
                <CardContent className="p-8 text-center">
                  <Shield className="w-16 h-16 text-green-600 mx-auto mb-4" />
                  <h3 className="text-2xl font-bold text-green-800 mb-4">
                    🔒 Pagamento 100% Seguro com Stripe
                  </h3>
                  <div className="grid md:grid-cols-3 gap-6 text-sm">
                    <div>
                      <Check className="w-6 h-6 text-green-500 mx-auto mb-2" />
                      <p className="font-medium">Processamento seguro</p>
                      <p className="text-gray-600">Dados protegidos</p>
                    </div>
                    <div>
                      <Check className="w-6 h-6 text-green-500 mx-auto mb-2" />
                      <p className="font-medium">Cancele quando quiser</p>
                      <p className="text-gray-600">Sem compromisso</p>
                    </div>
                    <div>
                      <Check className="w-6 h-6 text-green-500 mx-auto mb-2" />
                      <p className="font-medium">Suporte prioritário</p>
                      <p className="text-gray-600">Atendimento rápido</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default UpgradePage;

import { useState } from "react";
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
  Loader2
} from "lucide-react";
import { usePlan } from "@/hooks/usePlan";
import { useToast } from "@/hooks/use-toast";

const UpgradePage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { isPro, isFounder, canUpgrade, founderCount, createCheckoutSession, loading } = usePlan();
  const [upgrading, setUpgrading] = useState(false);

  const handleUpgrade = async () => {
    if (!canUpgrade) {
      toast({
        title: "Oferta encerrada",
        description: "A oferta de fundador já atingiu o limite de 10.000 usuários.",
        variant: "destructive"
      });
      return;
    }

    setUpgrading(true);
    try {
      await createCheckoutSession();
      toast({
        title: "Redirecionando...",
        description: "Você será redirecionado para o checkout do Stripe.",
      });
    } catch (error) {
      console.error('Error during upgrade:', error);
      toast({
        title: "Erro no upgrade",
        description: "Ocorreu um erro ao iniciar o processo de upgrade. Tente novamente.",
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b">
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

      <div className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <Crown className="w-12 h-12 text-yellow-500 mr-2" />
            <h1 className="text-4xl font-bold text-gray-900">
              Seja um Fundador PRO
            </h1>
          </div>
          
          <p className="text-xl text-gray-600 mb-6">
            Junte-se aos primeiros 10.000 usuários e desbloqueie recursos ilimitados
          </p>

          {/* Founder Counter */}
          <div className="inline-flex items-center space-x-4 bg-white rounded-full px-6 py-3 shadow-lg border">
            <Users className="w-5 h-5 text-purple-600" />
            <span className="font-semibold text-gray-900">
              {founderCount.toLocaleString()} / 10.000 Fundadores
            </span>
            <div className="w-32 bg-gray-200 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${Math.min((founderCount / 10000) * 100, 100)}%` }}
              />
            </div>
          </div>

          {!canUpgrade && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg max-w-md mx-auto">
              <p className="text-red-700 font-medium">
                🔥 Oferta Fundador Encerrada
              </p>
              <p className="text-red-600 text-sm">
                Atingimos o limite de 10.000 fundadores. O plano PRO regular estará disponível em breve.
              </p>
            </div>
          )}
        </div>

        {/* Already Pro Message */}
        {isPro && (
          <div className="max-w-2xl mx-auto mb-8">
            <Card className="border-green-200 bg-green-50">
              <CardContent className="text-center py-8">
                <Shield className="w-16 h-16 text-green-600 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-green-800 mb-2">
                  Você já é {isFounder ? 'Fundador ' : ''}PRO! 🎉
                </h2>
                <p className="text-green-700 mb-4">
                  Aproveite todos os recursos ilimitados do LinkBio.AI
                </p>
                <Button onClick={() => navigate('/dashboard')} className="bg-green-600 hover:bg-green-700">
                  Ir para o Dashboard
                </Button>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Plans Comparison */}
        {!isPro && (
          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto mb-12">
            {/* Free Plan */}
            <Card className="relative">
              <CardHeader>
                <CardTitle className="text-2xl text-center">Free</CardTitle>
                <CardDescription className="text-center">
                  Para começar
                </CardDescription>
                <div className="text-center">
                  <span className="text-4xl font-bold">$0</span>
                  <span className="text-gray-600">/mês</span>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <span>Até 10 links ativos</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <span>Todos os 4 temas disponíveis</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <span>Analytics básico</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <span>Upload de avatar</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <span>QR Code</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <span>Redes sociais ilimitadas</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* PRO Plan */}
            <Card className="relative border-2 border-purple-500 shadow-2xl">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-1">
                  🔥 OFERTA FUNDADOR
                </Badge>
              </div>
              
              <CardHeader className="pt-8">
                <CardTitle className="text-2xl text-center flex items-center justify-center">
                  <Crown className="w-6 h-6 text-yellow-500 mr-2" />
                  Fundador PRO 
                </CardTitle>
                <CardDescription className="text-center">
                  Recursos ilimitados por vida
                </CardDescription>
                <div className="text-center">
                  <span className="text-5xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                    $1
                  </span>
                  <span className="text-gray-600">/mês</span>
                  <div className="text-sm text-gray-500 line-through">
                    Era $19/mês
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
                    <span className="font-medium">Todos os temas + futuros</span>
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
                    <span className="font-medium">Remove branding</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Star className="w-5 h-5 text-yellow-500 flex-shrink-0" />
                    <span className="font-medium">Badge Fundador</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Crown className="w-5 h-5 text-yellow-500 flex-shrink-0" />
                    <span className="font-medium">Preço vitalício congelado</span>
                  </div>
                </div>

                <Button
                  onClick={handleUpgrade}
                  disabled={upgrading || !canUpgrade}
                  className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold py-3 text-lg"
                >
                  {upgrading ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Processando...
                    </>
                  ) : canUpgrade ? (
                    <>
                      <Crown className="w-5 h-5 mr-2" />
                      Ser Fundador PRO - $1/mês
                    </>
                  ) : (
                    "Oferta Encerrada"
                  )}
                </Button>

                {canUpgrade && (
                  <p className="text-xs text-center text-gray-600">
                    Pagamento seguro via Stripe • Cancele quando quiser
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {/* Benefits Section */}
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-8">
            Por que ser um Fundador PRO?
          </h2>
          
          <div className="grid md:grid-cols-3 gap-6">
            <Card>
              <CardContent className="p-6 text-center">
                <Crown className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
                <h3 className="font-bold mb-2">Status de Fundador</h3>
                <p className="text-gray-600 text-sm">
                  Badge exclusivo e reconhecimento como um dos primeiros usuários PRO
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6 text-center">
                <Shield className="w-12 h-12 text-green-500 mx-auto mb-4" />
                <h3 className="font-bold mb-2">Preço Congelado</h3>
                <p className="text-gray-600 text-sm">
                  Mantenha $1/mês para sempre, mesmo quando o preço regular aumentar
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6 text-center">
                <Zap className="w-12 h-12 text-purple-500 mx-auto mb-4" />
                <h3 className="font-bold mb-2">Acesso Completo</h3>
                <p className="text-gray-600 text-sm">
                  Todos os recursos atuais e futuros incluídos no seu plano
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpgradePage;

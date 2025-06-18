
import { AlertTriangle, Crown, ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { usePlan } from "@/hooks/usePlan";

interface PlanLimitAlertProps {
  currentCount: number;
  itemType: "links" | "themes";
  showUpgrade?: boolean;
}

export function PlanLimitAlert({ currentCount, itemType, showUpgrade = true }: PlanLimitAlertProps) {
  const navigate = useNavigate();
  const { maxLinks, canUpgrade, founderCount } = usePlan();

  const isAtLimit = itemType === "links" && currentCount >= maxLinks;
  const isNearLimit = itemType === "links" && currentCount >= maxLinks - 1;

  if (!isAtLimit && !isNearLimit) return null;

  const remainingFounders = Math.max(10000 - founderCount, 0);

  return (
    <Card className={`border-2 ${isAtLimit ? 'border-red-200 bg-gradient-to-r from-red-50 to-orange-50' : 'border-yellow-200 bg-gradient-to-r from-yellow-50 to-orange-50'} shadow-lg`}>
      <CardContent className="p-6">
        <div className="flex items-start space-x-4">
          <div className={`p-2 rounded-full ${isAtLimit ? 'bg-red-100' : 'bg-yellow-100'}`}>
            <AlertTriangle className={`w-6 h-6 ${isAtLimit ? 'text-red-500' : 'text-yellow-500'}`} />
          </div>
          
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-3">
              <h4 className={`font-bold text-lg ${isAtLimit ? 'text-red-800' : 'text-yellow-800'}`}>
                {isAtLimit ? '🚨 Limite atingido!' : '⚠️ Quase no limite!'}
              </h4>
              {canUpgrade && (
                <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white animate-pulse">
                  <Crown className="w-3 h-3 mr-1" />
                  Upgrade Disponível
                </Badge>
              )}
            </div>
            
            <p className={`mb-4 ${isAtLimit ? 'text-red-700' : 'text-yellow-700'}`}>
              {isAtLimit 
                ? `Você atingiu o limite de ${maxLinks} ${itemType} do plano gratuito. Para adicionar mais ${itemType}, faça upgrade para PRO!`
                : `Você está usando ${currentCount} de ${maxLinks} ${itemType} disponíveis. Está quase no limite!`
              }
            </p>

            {showUpgrade && canUpgrade && (
              <div className="bg-white/80 backdrop-blur-sm rounded-lg p-4 border border-purple-200">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h5 className="font-bold text-purple-800 mb-1">🔥 Oferta Fundador PRO</h5>
                    <p className="text-sm text-purple-700">
                      Seja um dos <span className="font-bold">{remainingFounders.toLocaleString()} fundadores restantes</span>
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-green-600">$1</div>
                    <div className="text-xs text-gray-600">por mês</div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <Button 
                    size="sm" 
                    onClick={() => navigate('/upgrade')}
                    className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 shadow-lg transform hover:scale-105 transition-all duration-200"
                  >
                    <Crown className="w-4 h-4 mr-2" />
                    Ser Fundador PRO
                    <Sparkles className="w-4 h-4 ml-2" />
                  </Button>
                  
                  <div className="text-xs text-gray-600">
                    <div className="font-medium">{founderCount.toLocaleString()}/10.000 fundadores</div>
                    <div className="text-green-600">✅ Recursos ilimitados</div>
                  </div>
                </div>
              </div>
            )}

            {!canUpgrade && (
              <div className="bg-gray-100 rounded-lg p-4 border">
                <p className="text-sm text-gray-600 font-medium">
                  🔥 A oferta de fundador encerrou (10.000 limite atingido)
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Aguarde o lançamento do plano PRO regular.
                </p>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

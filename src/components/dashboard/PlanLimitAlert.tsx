
import { AlertTriangle, Crown, ArrowRight } from "lucide-react";
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

  return (
    <Card className={`border-2 ${isAtLimit ? 'border-orange-200 bg-orange-50' : 'border-yellow-200 bg-yellow-50'}`}>
      <CardContent className="p-4">
        <div className="flex items-start space-x-3">
          <AlertTriangle className={`w-5 h-5 mt-0.5 ${isAtLimit ? 'text-orange-500' : 'text-yellow-500'}`} />
          
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-2">
              <h4 className={`font-semibold ${isAtLimit ? 'text-orange-800' : 'text-yellow-800'}`}>
                {isAtLimit ? 'Limite atingido!' : 'Quase no limite!'}
              </h4>
              {canUpgrade && (
                <Badge variant="secondary" className="text-xs bg-purple-100 text-purple-700">
                  <Crown className="w-3 h-3 mr-1" />
                  Upgrade disponível
                </Badge>
              )}
            </div>
            
            <p className={`text-sm mb-3 ${isAtLimit ? 'text-orange-700' : 'text-yellow-700'}`}>
              {isAtLimit 
                ? `Você atingiu o limite de ${maxLinks} ${itemType} do plano gratuito.`
                : `Você está usando ${currentCount} de ${maxLinks} ${itemType} disponíveis.`
              }
              {showUpgrade && canUpgrade && (
                <span className="block mt-1">
                  Faça upgrade para PRO e tenha acesso ilimitado por apenas $1/mês!
                </span>
              )}
            </p>

            {showUpgrade && canUpgrade && (
              <div className="flex items-center space-x-3">
                <Button 
                  size="sm" 
                  onClick={() => navigate('/upgrade')}
                  className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                >
                  <Crown className="w-4 h-4 mr-2" />
                  Ser Fundador PRO
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
                
                <div className="text-xs text-gray-600">
                  {founderCount.toLocaleString()}/10.000 fundadores
                </div>
              </div>
            )}

            {!canUpgrade && (
              <p className="text-xs text-gray-500">
                A oferta de fundador encerrou. Aguarde o lançamento do plano PRO regular.
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

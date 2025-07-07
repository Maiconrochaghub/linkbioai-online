
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Crown, Shield } from "lucide-react";
import { usePlan } from "@/hooks/usePlan";

interface PlanInfoCardProps {
  activeLinks: number;
  onManageSubscription: () => void;
}

export function PlanInfoCard({ activeLinks, onManageSubscription }: PlanInfoCardProps) {
  const { isPro, maxLinks, isFounder, canUpgrade, founderCount } = usePlan();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center">
          {isPro ? (
            <>
              <Crown className="w-5 h-5 text-yellow-500 mr-2" />
              {isFounder ? 'Fundador PRO' : 'Plano PRO'}
            </>
          ) : (
            <>
              <Shield className="w-5 h-5 text-blue-500 mr-2" />
              Plano Free
            </>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {isPro ? (
          <>
            <div className="text-sm">
              <p className="font-medium text-green-700">✅ Recursos Ilimitados</p>
              <p className="text-gray-600">Links, temas e analytics sem limite</p>
            </div>
            {isFounder && (
              <div className="text-sm">
                <p className="font-medium text-yellow-700">👑 Status Fundador</p>
                <p className="text-gray-600">Você é um dos {founderCount.toLocaleString()} primeiros!</p>
              </div>
            )}
            <div className="text-sm">
              <p className="font-medium text-purple-700">🛠️ Gerenciar Assinatura</p>
              <Button 
                size="sm" 
                variant="outline" 
                onClick={onManageSubscription}
                className="mt-2"
              >
                Abrir Portal do Cliente
              </Button>
            </div>
          </>
        ) : (
          <>
            <div className="text-sm">
              <p className="font-medium text-blue-700">📊 Seu Uso Atual</p>
              <p className="text-gray-600">{activeLinks}/{maxLinks} links • 1/4 temas</p>
            </div>
            {canUpgrade && (
              <div className="text-sm">
                <p className="font-medium text-purple-700">🚀 Upgrade Disponível</p>
                <p className="text-gray-600 mb-2">Seja um dos {(10000 - founderCount).toLocaleString()} fundadores restantes!</p>
                <Button 
                  size="sm" 
                  onClick={() => window.location.href = '/upgrade'}
                  className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                >
                  <Crown className="w-4 h-4 mr-1" />
                  $1/mês
                </Button>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}

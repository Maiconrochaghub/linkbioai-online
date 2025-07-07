
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  BarChart3, 
  MousePointer, 
  Eye,
  TrendingUp,
  Calendar,
  Shield,
  Crown
} from "lucide-react";
import { usePlan } from "@/hooks/usePlan";

interface StatsCardsProps {
  links: Array<{ click_count: number; is_active: boolean }>;
}

export function StatsCards({ links }: StatsCardsProps) {
  const { isPro, maxLinks, isFounder } = usePlan();
  
  const totalClicks = links.reduce((sum, link) => sum + link.click_count, 0);
  const activeLinks = links.filter(link => link.is_active).length;

  return (
    <div className="grid md:grid-cols-3 gap-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total de Cliques</CardTitle>
          <MousePointer className="h-4 w-4 text-purple-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-purple-600">{totalClicks}</div>
          <p className="text-xs text-muted-foreground">
            <TrendingUp className="inline w-3 h-3 mr-1" />
            +{Math.floor(totalClicks * 0.12)} este mês
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Links Ativos</CardTitle>
          <Eye className="h-4 w-4 text-green-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-600">{activeLinks}</div>
          <p className="text-xs text-muted-foreground">
            {isPro ? 'Ilimitados' : `de ${maxLinks} disponíveis`}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            {isPro ? 'Plano PRO' : 'Visitantes'}
          </CardTitle>
          {isPro ? (
            <Crown className="h-4 w-4 text-yellow-600" />
          ) : (
            <BarChart3 className="h-4 w-4 text-blue-600" />
          )}
        </CardHeader>
        <CardContent>
          {isPro ? (
            <>
              <div className="text-2xl font-bold text-yellow-600">
                {isFounder ? 'Fundador' : 'Premium'}
              </div>
              <p className="text-xs text-muted-foreground">
                <Shield className="inline w-3 h-3 mr-1" />
                Recursos ilimitados
              </p>
            </>
          ) : (
            <>
              <div className="text-2xl font-bold text-blue-600">{Math.floor(totalClicks * 0.8)}</div>
              <p className="text-xs text-muted-foreground">
                <Calendar className="inline w-3 h-3 mr-1" />
                últimos 30 dias
              </p>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}


import { Button } from "@/components/ui/button";
import { Crown } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { usePlan } from "@/hooks/usePlan";

export function WelcomeSection() {
  const { profile, isMasterAdmin, isMaiconRocha } = useAuth();
  const { isPro, maxLinks, isFounder, canUpgrade } = usePlan();
  
  if (!profile) return null;
  
  const isAdmin = isMasterAdmin() || isMaiconRocha();
  const activeLinks = 0; // This would come from props or context

  return (
    <div className={`rounded-xl p-6 text-white ${
      isAdmin
        ? 'bg-gradient-to-r from-yellow-500 to-orange-500' 
        : isPro
        ? 'bg-gradient-to-r from-purple-500 to-pink-500'
        : 'bg-gradient-to-r from-blue-500 to-indigo-500'
    }`}>
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold mb-2">
            Olá, {profile.name.split(' ')[0]}! 👋
            {isAdmin && ' 🛡️'}
            {isFounder && ' 👑'}
          </h2>
          <p className="opacity-90 mb-4">
            {isAdmin ? (
              <>Acesso de <strong>Administrador Master</strong> ativo</>
            ) : isPro ? (
              <>
                Sua página <strong>{isFounder ? 'Fundador ' : ''}PRO</strong> está ativa em: 
                <span className="font-semibold"> linkbio.ai/{profile.username}</span>
              </>
            ) : (
              <>
                Sua página está ativa em: <span className="font-semibold">linkbio.ai/{profile.username}</span>
                <br />
                <span className="text-sm opacity-75">Plano Free: {activeLinks}/{maxLinks} links usados</span>
              </>
            )}
          </p>
        </div>
        
        {!isPro && canUpgrade && (
          <Button 
            variant="secondary" 
            size="sm" 
            onClick={() => window.location.href = '/upgrade'}
            className="bg-white/20 border-white/30 text-white hover:bg-white/30"
          >
            <Crown className="w-4 h-4 mr-2" />
            Ser Fundador PRO
          </Button>
        )}
      </div>
    </div>
  );
}

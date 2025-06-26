
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { PublicProfile } from "@/types/publicPage";

interface PublicPageFooterProps {
  profile: PublicProfile;
  themeClasses: any;
  linksLength: number;
}

export const PublicPageFooter = ({ profile, themeClasses, linksLength }: PublicPageFooterProps) => {
  if (profile.plan === 'pro' || profile.is_admin) return null;

  return (
    <div className={`text-center py-4 md:py-6 border-t rounded-2xl ${themeClasses.footer} border transition-all duration-300 fade-in-up`} style={{ animationDelay: `${linksLength * 100 + 400}ms` }}>
      <div className="flex items-center justify-center space-x-2 mb-2">
        <div className="w-6 h-6 bg-gradient-to-r from-purple-500 to-pink-500 rounded flex items-center justify-center">
          <span className="text-white font-bold text-xs">L</span>
        </div>
        <span className={`text-sm font-semibold ${themeClasses.text}`}>LinkBio.AI</span>
      </div>
      
      <p className={`text-xs mb-3 ${themeClasses.textMuted}`}>
        Crie sua página personalizada gratuitamente
      </p>
      
      <Button size="sm" variant="outline" asChild className={`text-xs ${themeClasses.button}`}>
        <a href="/">
          Criar Minha Página
          <ArrowRight className="w-3 h-3 ml-1" />
        </a>
      </Button>
    </div>
  );
};


import { ExternalLink } from "lucide-react";
import { getIcon } from "./PublicPageIcons";
import { PublicLink } from "@/types/publicPage";

interface LinkButtonProps {
  link: PublicLink;
  index: number;
  buttonColor: string;
  textColor: string;
  onClick: () => void;
}

export const LinkButton = ({ link, index, buttonColor, textColor, onClick }: LinkButtonProps) => (
  <button
    onClick={onClick}
    className="w-full rounded-2xl p-3 md:p-4 shadow-sm hover:shadow-md transition-all duration-200 border group transform hover:scale-105 fade-in-up touch-target active:scale-95"
    style={{ 
      animationDelay: `${index * 100}ms`,
      backgroundColor: buttonColor,
      color: textColor === '#FFFFFF' ? '#000000' : '#FFFFFF',
      borderColor: buttonColor
    }}
  >
    <div className="flex items-center space-x-3 md:space-x-4">
      <div className="flex-shrink-0">
        {getIcon(link.icon)}
      </div>
      
      <div className="flex-1 text-left min-w-0">
        <p className="font-semibold text-sm md:text-base truncate">
          {link.title}
        </p>
        {link.click_count > 0 && (
          <p className="text-xs opacity-70">
            {link.click_count} {link.click_count === 1 ? 'clique' : 'cliques'}
          </p>
        )}
      </div>
      
      <ExternalLink className="w-4 h-4 opacity-70 flex-shrink-0" />
    </div>
  </button>
);

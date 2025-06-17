
import { Crown, Shield } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface FounderBadgeProps {
  isFounder?: boolean;
  isPro?: boolean;
  size?: "sm" | "md" | "lg";
  showText?: boolean;
}

export function FounderBadge({ isFounder, isPro, size = "md", showText = true }: FounderBadgeProps) {
  if (!isPro) return null;

  const sizeClasses = {
    sm: "text-xs px-2 py-1",
    md: "text-sm px-3 py-1",
    lg: "text-base px-4 py-2"
  };

  const iconSize = {
    sm: "w-3 h-3",
    md: "w-4 h-4", 
    lg: "w-5 h-5"
  };

  if (isFounder) {
    return (
      <Badge 
        className={`bg-gradient-to-r from-yellow-400 to-orange-500 text-white font-semibold ${sizeClasses[size]} flex items-center space-x-1`}
      >
        <Crown className={iconSize[size]} />
        {showText && <span>Founder PRO</span>}
      </Badge>
    );
  }

  return (
    <Badge 
      className={`bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold ${sizeClasses[size]} flex items-center space-x-1`}
    >
      <Shield className={iconSize[size]} />
      {showText && <span>PRO</span>}
    </Badge>
  );
}


import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { PublicProfile } from "@/types/publicPage";

interface ProfileHeaderProps {
  profile: PublicProfile;
  themeClasses: any;
  textColor: string;
}

export const ProfileHeader = ({ profile, themeClasses, textColor }: ProfileHeaderProps) => (
  <div className={`text-center mb-6 md:mb-8 ${themeClasses.container} rounded-2xl p-4 md:p-6 border transition-all duration-300 fade-in-up`}>
    <Avatar className="w-20 h-20 md:w-24 md:h-24 mx-auto mb-3 md:mb-4 border-4 border-white shadow-lg">
      <AvatarImage 
        src={profile.avatar_url} 
        alt={profile.name}
        loading="eager"
        onError={(e) => {
          console.log('Avatar failed to load:', profile.avatar_url);
        }}
      />
      <AvatarFallback className="bg-purple-100 text-purple-600 text-xl md:text-2xl font-bold">
        {profile.name.charAt(0).toUpperCase()}
      </AvatarFallback>
    </Avatar>
    
    <h1 className="text-xl md:text-2xl font-bold mb-2" style={{ color: textColor }}>
      {profile.name}
    </h1>
    
    {profile.bio && (
      <div className="mb-3 whitespace-pre-line text-sm leading-relaxed px-2" style={{ color: textColor, opacity: 0.8 }}>
        {profile.bio}
      </div>
    )}
    
    <div className="flex items-center justify-center gap-2 flex-wrap">
      <Badge variant="secondary" className={`text-xs md:text-sm ${themeClasses.badge}`}>
        @{profile.username}
      </Badge>
      {profile.is_founder && (
        <Badge variant="secondary" className="text-xs md:text-sm bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700">
          Founder PRO
        </Badge>
      )}
    </div>
  </div>
);

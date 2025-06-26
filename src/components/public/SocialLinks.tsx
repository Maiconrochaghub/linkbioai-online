
import { getSocialIcon } from "./PublicPageIcons";
import { PublicSocialLink } from "@/types/publicPage";

interface SocialLinksProps {
  socialLinks: PublicSocialLink[];
  linksLength: number;
  onSocialClick: (url: string, platform: string) => void;
}

export const SocialLinks = ({ socialLinks, linksLength, onSocialClick }: SocialLinksProps) => {
  if (!socialLinks || socialLinks.length === 0) return null;

  return (
    <div className="mb-6 md:mb-8 flex justify-center fade-in-up" style={{ animationDelay: `${linksLength * 100 + 200}ms` }}>
      <div className="flex justify-center flex-wrap gap-4 md:gap-6">
        {socialLinks.map((social) => (
          <button
            key={social.id}
            onClick={() => onSocialClick(social.url, social.platform)}
            className="transition-transform duration-200 hover:scale-110 transform touch-target active:scale-95 p-2 rounded-full hover:bg-white/10"
            title={social.platform}
          >
            {getSocialIcon(social.platform)}
          </button>
        ))}
      </div>
    </div>
  );
};

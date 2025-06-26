
import { 
  Instagram, 
  Youtube, 
  Github, 
  Twitter, 
  Linkedin, 
  Globe, 
  Phone, 
  Mail,
  Music
} from "lucide-react";

const iconMap = {
  instagram: <Instagram className="w-5 h-5 text-pink-500" />,
  youtube: <Youtube className="w-5 h-5 text-red-500" />,
  twitter: <Twitter className="w-5 h-5 text-blue-400" />,
  linkedin: <Linkedin className="w-5 h-5 text-blue-600" />,
  github: <Github className="w-5 h-5 text-gray-700" />,
  whatsapp: <Phone className="w-5 h-5 text-green-500" />,
  email: <Mail className="w-5 h-5 text-gray-600" />,
  website: <Globe className="w-5 h-5 text-blue-500" />,
  tiktok: <Music className="w-5 h-5 text-black" />,
  facebook: <Globe className="w-5 h-5 text-blue-600" />,
};

export const getIcon = (iconName: string) => {
  return iconMap[iconName as keyof typeof iconMap] || <Globe className="w-5 h-5 text-gray-500" />;
};

export const getSocialIcon = (platform: string) => {
  return iconMap[platform as keyof typeof iconMap] || <Globe className="w-5 h-5 text-gray-500" />;
};

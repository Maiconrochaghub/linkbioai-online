
export interface PublicProfile {
  id: string;
  name: string;
  username: string;
  avatar_url?: string;
  bio?: string;
  theme?: string;
  button_color?: string;
  text_color?: string;
  plan?: string;
  is_founder?: boolean;
  is_admin?: boolean;
}

export interface PublicLink {
  id: string;
  title: string;
  url: string;
  icon: string;
  position: number;
  click_count: number;
}

export interface PublicSocialLink {
  id: string;
  platform: string;
  url: string;
  position: number;
}

export interface PublicPageData {
  profile: PublicProfile;
  links: PublicLink[];
  socialLinks?: PublicSocialLink[];
}

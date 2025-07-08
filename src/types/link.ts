export interface Link {
  id: string;
  user_id: string;
  title: string;
  url: string;
  icon: string;
  position: number;
  is_active: boolean;
  click_count: number;
  created_at: string;
  updated_at: string;
}

export interface CreateLinkData {
  title: string;
  url: string;
  icon?: string;
}

export interface LinkValidationResult {
  isValid: boolean;
  cleanUrl?: string;
  cleanTitle?: string;
  error?: string;
}
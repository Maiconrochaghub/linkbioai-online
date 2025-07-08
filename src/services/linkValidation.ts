import { CreateLinkData, LinkValidationResult } from '@/types/link';

export function validateLinkData(linkData: CreateLinkData): LinkValidationResult {
  // Validate URL
  let cleanUrl = linkData.url.trim();
  if (!cleanUrl) {
    return {
      isValid: false,
      error: "URL é obrigatória"
    };
  }

  // Add protocol if missing
  if (!cleanUrl.startsWith('http://') && !cleanUrl.startsWith('https://')) {
    cleanUrl = 'https://' + cleanUrl;
  }

  // Validate title
  const cleanTitle = linkData.title.trim();
  if (!cleanTitle) {
    return {
      isValid: false,
      error: "Título é obrigatório"
    };
  }

  return {
    isValid: true,
    cleanUrl,
    cleanTitle
  };
}

export function validateUrl(url: string): string {
  let cleanUrl = url.trim();
  if (cleanUrl && !cleanUrl.startsWith('http://') && !cleanUrl.startsWith('https://')) {
    cleanUrl = 'https://' + cleanUrl;
  }
  return cleanUrl;
}

export function validateTitle(title: string): { isValid: boolean; cleanTitle?: string; error?: string } {
  const cleanTitle = title.trim();
  if (!cleanTitle) {
    return {
      isValid: false,
      error: "Título não pode estar vazio"
    };
  }
  return {
    isValid: true,
    cleanTitle
  };
}
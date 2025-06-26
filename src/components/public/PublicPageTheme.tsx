
export const getThemeClasses = (theme: string) => {
  const themeMap = {
    default: {
      background: 'bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 min-h-screen',
      container: 'bg-white/90 backdrop-blur-sm shadow-xl',
      text: 'text-gray-900',
      textSecondary: 'text-gray-600',
      textMuted: 'text-gray-500',
      button: 'bg-white hover:bg-gray-50 border-gray-200 hover:border-purple-200 hover:shadow-md',
      badge: 'bg-purple-100 text-purple-700',
      footer: 'bg-white/50 border-gray-200'
    },
    clean: {
      background: 'bg-gray-50 min-h-screen',
      container: 'bg-white shadow-lg',
      text: 'text-gray-900',
      textSecondary: 'text-gray-700',
      textMuted: 'text-gray-500',
      button: 'bg-white hover:bg-gray-50 border-gray-300 hover:border-gray-400 hover:shadow-md',
      badge: 'bg-gray-100 text-gray-700',
      footer: 'bg-gray-100/80 border-gray-200'
    },
    dark: {
      background: 'bg-gradient-to-br from-gray-900 via-gray-800 to-black min-h-screen',
      container: 'bg-gray-800/90 backdrop-blur-sm border-gray-700 shadow-2xl',
      text: 'text-white',
      textSecondary: 'text-gray-300',
      textMuted: 'text-gray-400',
      button: 'bg-gray-700 hover:bg-gray-600 border-gray-600 hover:border-gray-500 text-white hover:shadow-lg',
      badge: 'bg-gray-700 text-gray-200',
      footer: 'bg-gray-800/50 border-gray-700'
    },
    instagram: {
      background: 'bg-gradient-to-br from-pink-400 via-red-500 to-yellow-500 min-h-screen',
      container: 'bg-white/95 backdrop-blur-sm border-white/20 shadow-2xl',
      text: 'text-gray-900',
      textSecondary: 'text-gray-700',
      textMuted: 'text-gray-600',
      button: 'bg-white/90 hover:bg-white border-white/30 hover:border-pink-200 hover:shadow-lg',
      badge: 'bg-pink-100 text-pink-700',
      footer: 'bg-white/40 border-white/20'
    }
  };
  
  return themeMap[theme as keyof typeof themeMap] || themeMap.default;
};

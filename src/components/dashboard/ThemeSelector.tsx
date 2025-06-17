
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Palette, Check, Lock, Crown } from "lucide-react";
import { usePlan } from '@/hooks/usePlan';
import { useNavigate } from 'react-router-dom';

const THEMES = [
  {
    id: 'default',
    name: 'Padrão',
    description: 'Tema clássico com gradiente suave',
    preview: 'bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50',
    colors: ['bg-purple-500', 'bg-pink-500', 'bg-orange-400'],
    isPro: false
  },
  {
    id: 'clean',
    name: 'Clean',
    description: 'Design minimalista e limpo',
    preview: 'bg-gray-50',
    colors: ['bg-gray-100', 'bg-white', 'bg-gray-600'],
    isPro: true
  },
  {
    id: 'dark',
    name: 'Dark',
    description: 'Tema escuro elegante',
    preview: 'bg-gradient-to-br from-gray-900 via-gray-800 to-black',
    colors: ['bg-gray-900', 'bg-gray-700', 'bg-gray-500'],
    isPro: true
  },
  {
    id: 'instagram',
    name: 'Instagram',
    description: 'Gradiente vibrante estilo Instagram',
    preview: 'bg-gradient-to-br from-pink-500 via-red-500 to-yellow-400',
    colors: ['bg-pink-500', 'bg-red-500', 'bg-yellow-400'],
    isPro: true
  }
];

interface ThemeSelectorProps {
  selectedTheme: string;
  onThemeChange: (theme: string) => void;
}

export function ThemeSelector({ selectedTheme, onThemeChange }: ThemeSelectorProps) {
  const { isPro, canUpgrade } = usePlan();
  const navigate = useNavigate();

  const handleThemeSelect = (themeId: string) => {
    const theme = THEMES.find(t => t.id === themeId);
    
    if (theme?.isPro && !isPro) {
      // Don't change theme, show upgrade message
      return;
    }
    
    onThemeChange(themeId);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Palette className="w-5 h-5 mr-2 text-purple-600" />
          Tema da Página
        </CardTitle>
        <CardDescription>
          Escolha o visual da sua página pública
          {!isPro && (
            <span className="block text-orange-600 font-medium mt-1">
              Plano Free: Apenas tema Padrão disponível
            </span>
          )}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {THEMES.map((theme) => {
            const isLocked = theme.isPro && !isPro;
            const isSelected = selectedTheme === theme.id;
            
            return (
              <div
                key={theme.id}
                className={`relative p-4 rounded-lg border-2 cursor-pointer transition-all ${
                  isLocked 
                    ? 'border-gray-200 bg-gray-50 opacity-75' 
                    : isSelected
                    ? 'border-purple-500 bg-purple-50 shadow-lg hover:scale-105'
                    : 'border-gray-200 hover:border-gray-300 hover:scale-105'
                }`}
                onClick={() => handleThemeSelect(theme.id)}
              >
                {/* Theme Preview */}
                <div className={`w-full h-20 rounded-lg mb-3 ${theme.preview} relative overflow-hidden ${
                  isLocked ? 'filter grayscale' : ''
                }`}>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="flex space-x-1">
                      {theme.colors.map((color, index) => (
                        <div key={index} className={`w-3 h-3 rounded-full ${color} shadow-sm`} />
                      ))}
                    </div>
                  </div>
                  
                  {/* Lock Icon for PRO themes */}
                  {isLocked && (
                    <div className="absolute top-2 left-2 w-6 h-6 bg-gray-600 rounded-full flex items-center justify-center">
                      <Lock className="w-3 h-3 text-white" />
                    </div>
                  )}
                  
                  {/* Selection Indicator */}
                  {isSelected && !isLocked && (
                    <div className="absolute top-2 right-2 w-6 h-6 bg-purple-600 rounded-full flex items-center justify-center">
                      <Check className="w-4 h-4 text-white" />
                    </div>
                  )}
                </div>
                
                {/* Theme Info */}
                <div>
                  <div className="flex items-center space-x-2 mb-1">
                    <h4 className={`font-semibold ${isLocked ? 'text-gray-500' : 'text-gray-900'}`}>
                      {theme.name}
                    </h4>
                    {theme.isPro && (
                      <Crown className="w-4 h-4 text-yellow-500" />
                    )}
                  </div>
                  <p className={`text-sm ${isLocked ? 'text-gray-400' : 'text-gray-600'}`}>
                    {theme.description}
                  </p>
                  
                  {isLocked && canUpgrade && (
                    <Button
                      size="sm"
                      variant="outline"
                      className="mt-2 text-xs"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate('/upgrade');
                      }}
                    >
                      <Crown className="w-3 h-3 mr-1" />
                      Upgrade para usar
                    </Button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
        
        <div className={`mt-4 p-3 rounded-lg ${isPro ? 'bg-green-50' : 'bg-blue-50'}`}>
          <p className={`text-sm ${isPro ? 'text-green-700' : 'text-blue-700'}`}>
            {isPro ? (
              <>
                🎉 <strong>Plano PRO:</strong> Você tem acesso a todos os temas! 
                Experimente diferentes visuais para sua página.
              </>  
            ) : (
              <>
                💡 <strong>Dica:</strong> Upgrade para PRO e desbloqueie todos os temas profissionais. 
                {canUpgrade && 'Apenas $1/mês para fundadores!'}
              </>
            )}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}


import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Palette, Check } from "lucide-react";
import { usePlan } from '@/hooks/usePlan';

const THEMES = [
  {
    id: 'default',
    name: 'Padrão',
    description: 'Tema clássico com gradiente suave',
    preview: 'bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50',
    colors: ['bg-purple-500', 'bg-pink-500', 'bg-orange-400'],
    isPro: false // Now available for everyone
  },
  {
    id: 'clean',
    name: 'Clean',
    description: 'Design minimalista e limpo',
    preview: 'bg-gray-50',
    colors: ['bg-gray-100', 'bg-white', 'bg-gray-600'],
    isPro: false // Now available for everyone
  },
  {
    id: 'dark',
    name: 'Dark',
    description: 'Tema escuro elegante',
    preview: 'bg-gradient-to-br from-gray-900 via-gray-800 to-black',
    colors: ['bg-gray-900', 'bg-gray-700', 'bg-gray-500'],
    isPro: false // Now available for everyone
  },
  {
    id: 'instagram',
    name: 'Instagram',
    description: 'Gradiente vibrante estilo Instagram',
    preview: 'bg-gradient-to-br from-pink-500 via-red-500 to-yellow-400',
    colors: ['bg-pink-500', 'bg-red-500', 'bg-yellow-400'],
    isPro: false // Now available for everyone
  }
];

interface ThemeSelectorProps {
  selectedTheme: string;
  onThemeChange: (theme: string) => void;
}

export function ThemeSelector({ selectedTheme, onThemeChange }: ThemeSelectorProps) {
  const { isPro } = usePlan();

  const handleThemeSelect = (themeId: string) => {
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
          <span className="block text-green-600 font-medium mt-1">
            ✨ Todos os temas agora disponíveis para todos os usuários!
          </span>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {THEMES.map((theme) => {
            const isSelected = selectedTheme === theme.id;
            
            return (
              <div
                key={theme.id}
                className={`relative p-4 rounded-lg border-2 cursor-pointer transition-all hover:scale-105 ${
                  isSelected
                    ? 'border-purple-500 bg-purple-50 shadow-lg'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => handleThemeSelect(theme.id)}
              >
                {/* Theme Preview */}
                <div className={`w-full h-20 rounded-lg mb-3 ${theme.preview} relative overflow-hidden`}>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="flex space-x-1">
                      {theme.colors.map((color, index) => (
                        <div key={index} className={`w-3 h-3 rounded-full ${color} shadow-sm`} />
                      ))}
                    </div>
                  </div>
                  
                  {/* Selection Indicator */}
                  {isSelected && (
                    <div className="absolute top-2 right-2 w-6 h-6 bg-purple-600 rounded-full flex items-center justify-center">
                      <Check className="w-4 h-4 text-white" />
                    </div>
                  )}
                </div>
                
                {/* Theme Info */}
                <div>
                  <div className="flex items-center space-x-2 mb-1">
                    <h4 className="font-semibold text-gray-900">
                      {theme.name}
                    </h4>
                  </div>
                  <p className="text-sm text-gray-600">
                    {theme.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
        
        <div className="mt-4 p-3 rounded-lg bg-green-50">
          <p className="text-sm text-green-700">
            🎉 <strong>Novidade:</strong> Todos os temas agora estão disponíveis gratuitamente! 
            Experimente diferentes visuais para sua página e encontre o que mais combina com seu estilo.
            {isPro && ' Como usuário PRO, você ainda tem acesso a recursos exclusivos como analytics avançado e links ilimitados.'}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

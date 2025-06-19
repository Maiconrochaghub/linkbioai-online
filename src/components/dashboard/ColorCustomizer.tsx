
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Palette, Save } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const colorPresets = {
  purple: { button: '#8B5CF6', text: '#1F2937' },
  blue: { button: '#3B82F6', text: '#1F2937' },
  green: { button: '#10B981', text: '#1F2937' },
  pink: { button: '#EC4899', text: '#1F2937' },
  orange: { button: '#F59E0B', text: '#1F2937' },
  red: { button: '#EF4444', text: '#1F2937' },
  dark: { button: '#374151', text: '#FFFFFF' },
  light: { button: '#F3F4F6', text: '#1F2937' }
};

export function ColorCustomizer() {
  const { profile, updateProfile } = useAuth();
  const [buttonColor, setButtonColor] = useState(profile?.button_color || '#8B5CF6');
  const [textColor, setTextColor] = useState(profile?.text_color || '#1F2937');
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    const { error } = await updateProfile({
      button_color: buttonColor,
      text_color: textColor
    });
    
    if (!error) {
      // Toast is handled by updateProfile
    }
    setSaving(false);
  };

  const applyPreset = (preset: keyof typeof colorPresets) => {
    setButtonColor(colorPresets[preset].button);
    setTextColor(colorPresets[preset].text);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Palette className="w-5 h-5" />
          Personalização de Cores
        </CardTitle>
        <CardDescription>
          Customize as cores dos botões e texto da sua página
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Color Presets */}
        <div className="space-y-3">
          <Label>Paletas Predefinidas</Label>
          <div className="grid grid-cols-4 gap-2">
            {Object.entries(colorPresets).map(([name, colors]) => (
              <button
                key={name}
                onClick={() => applyPreset(name as keyof typeof colorPresets)}
                className="p-2 rounded-lg border-2 border-gray-200 hover:border-purple-300 transition-colors"
                title={name}
              >
                <div className="flex flex-col gap-1">
                  <div 
                    className="w-full h-6 rounded"
                    style={{ backgroundColor: colors.button }}
                  />
                  <div 
                    className="w-full h-2 rounded"
                    style={{ backgroundColor: colors.text }}
                  />
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Custom Colors */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="button-color">Cor dos Botões</Label>
            <div className="flex gap-2">
              <input
                id="button-color"
                type="color"
                value={buttonColor}
                onChange={(e) => setButtonColor(e.target.value)}
                className="w-12 h-10 rounded border border-gray-300 cursor-pointer"
              />
              <input
                type="text"
                value={buttonColor}
                onChange={(e) => setButtonColor(e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md"
                placeholder="#8B5CF6"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="text-color">Cor do Texto</Label>
            <div className="flex gap-2">
              <input
                id="text-color"
                type="color"
                value={textColor}
                onChange={(e) => setTextColor(e.target.value)}
                className="w-12 h-10 rounded border border-gray-300 cursor-pointer"
              />
              <input
                type="text"
                value={textColor}
                onChange={(e) => setTextColor(e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md"
                placeholder="#1F2937"
              />
            </div>
          </div>
        </div>

        {/* Preview */}
        <div className="space-y-3">
          <Label>Preview</Label>
          <div className="p-4 bg-gray-50 rounded-lg">
            <h3 style={{ color: textColor }} className="font-semibold mb-2">
              Seu Nome
            </h3>
            <p style={{ color: textColor }} className="text-sm mb-3 opacity-80">
              Sua biografia aparecerá aqui
            </p>
            <button
              style={{ 
                backgroundColor: buttonColor,
                color: textColor === '#FFFFFF' ? '#000000' : '#FFFFFF'
              }}
              className="w-full py-3 px-4 rounded-xl font-medium"
            >
              Exemplo de Link
            </button>
          </div>
        </div>

        {/* Save Button */}
        <Button
          onClick={handleSave}
          disabled={saving}
          className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
        >
          {saving ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
              Salvando...
            </>
          ) : (
            <>
              <Save className="w-4 h-4 mr-2" />
              Salvar Cores
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
}

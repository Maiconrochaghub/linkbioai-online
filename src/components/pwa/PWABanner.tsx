
import React, { useState, useEffect } from 'react';
import { Download, X, Smartphone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { usePWA } from '@/hooks/usePWA';

export const PWABanner: React.FC = () => {
  const { isInstallable, isInstalled, installApp } = usePWA();
  const [showBanner, setShowBanner] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    // Mostrar banner apenas se for instalável e não foi dismissado
    const bannerDismissed = localStorage.getItem('pwa-banner-dismissed');
    if (isInstallable && !isInstalled && !bannerDismissed) {
      setShowBanner(true);
    }
  }, [isInstallable, isInstalled]);

  const handleInstall = async () => {
    const success = await installApp();
    if (success) {
      setShowBanner(false);
    }
  };

  const handleDismiss = () => {
    setShowBanner(false);
    setDismissed(true);
    localStorage.setItem('pwa-banner-dismissed', 'true');
  };

  if (!showBanner || dismissed) {
    return null;
  }

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Smartphone className="w-5 h-5" />
            <div className="flex-1">
              <p className="text-sm font-medium">
                📱 Instale o LinkBio.AI no seu dispositivo!
              </p>
              <p className="text-xs opacity-90">
                Acesso rápido, notificações e funciona offline
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button 
              size="sm" 
              variant="secondary"
              onClick={handleInstall}
              className="bg-white/20 border-white/30 text-white hover:bg-white/30"
            >
              <Download className="w-4 h-4 mr-1" />
              Instalar
            </Button>
            <Button 
              size="sm" 
              variant="ghost"
              onClick={handleDismiss}
              className="text-white hover:bg-white/20 p-1"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};


import React from 'react';
import { Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { usePWA } from '@/hooks/usePWA';
import { toast } from 'sonner';

interface InstallButtonProps {
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'sm' | 'default' | 'lg';
  className?: string;
}

export const InstallButton: React.FC<InstallButtonProps> = ({ 
  variant = 'default', 
  size = 'default',
  className = ''
}) => {
  const { isInstallable, isInstalled, installApp } = usePWA();

  const handleInstall = async () => {
    const success = await installApp();
    
    if (success) {
      toast.success('App instalado com sucesso!');
    } else {
      toast.error('Não foi possível instalar o app. Tente adicionar aos favoritos.');
    }
  };

  // Don't show button if already installed or not installable
  if (isInstalled || !isInstallable) {
    return null;
  }

  return (
    <Button 
      onClick={handleInstall}
      variant={variant}
      size={size}
      className={className}
    >
      <Download className="w-4 h-4 mr-2" />
      Instalar App
    </Button>
  );
};

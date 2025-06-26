
import React, { useState, useEffect } from 'react';
import { Download, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

export const UpdateNotification: React.FC = () => {
  const [showUpdate, setShowUpdate] = useState(false);
  const [registration, setRegistration] = useState<ServiceWorkerRegistration | null>(null);

  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.getRegistration().then((reg) => {
        if (reg) {
          setRegistration(reg);
          
          // Verificar se há update waiting
          if (reg.waiting) {
            setShowUpdate(true);
          }
          
          // Escutar por novos updates
          reg.addEventListener('updatefound', () => {
            const newWorker = reg.installing;
            if (newWorker) {
              newWorker.addEventListener('statechange', () => {
                if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                  setShowUpdate(true);
                }
              });
            }
          });
        }
      });

      // Escutar mensagens do service worker
      navigator.serviceWorker.addEventListener('message', (event) => {
        if (event.data && event.data.type === 'UPDATE_AVAILABLE') {
          setShowUpdate(true);
        }
      });
    }
  }, []);

  const handleUpdate = () => {
    if (registration && registration.waiting) {
      registration.waiting.postMessage({ type: 'SKIP_WAITING' });
      window.location.reload();
    }
  };

  const handleDismiss = () => {
    setShowUpdate(false);
  };

  if (!showUpdate) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-sm">
      <Card className="bg-white shadow-lg border border-purple-200">
        <CardContent className="p-4">
          <div className="flex items-start space-x-3">
            <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center flex-shrink-0">
              <Download className="w-4 h-4 text-white" />
            </div>
            
            <div className="flex-1 min-w-0">
              <h4 className="font-medium text-gray-900 mb-1">
                Nova versão disponível!
              </h4>
              <p className="text-sm text-gray-600 mb-3">
                Uma nova versão do LinkBio.AI está pronta. Atualize para ter acesso às últimas funcionalidades.
              </p>
              
              <div className="flex space-x-2">
                <Button 
                  size="sm" 
                  onClick={handleUpdate}
                  className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                >
                  Atualizar
                </Button>
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={handleDismiss}
                >
                  Depois
                </Button>
              </div>
            </div>
            
            <Button 
              size="sm" 
              variant="ghost" 
              onClick={handleDismiss}
              className="p-1 h-auto"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

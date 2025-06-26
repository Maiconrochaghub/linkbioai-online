
import React from 'react';
import { WifiOff, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const OfflinePage: React.FC = () => {
  const handleRefresh = () => {
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="text-center max-w-md">
        <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center mx-auto mb-6">
          <WifiOff className="w-8 h-8 text-white" />
        </div>
        
        <h1 className="text-2xl font-bold mb-2 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
          Você está offline
        </h1>
        
        <p className="text-gray-600 mb-6">
          Parece que você perdeu a conexão com a internet. Verifique sua conexão e tente novamente.
        </p>
        
        <div className="space-y-4">
          <Button 
            onClick={handleRefresh}
            className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Tentar Novamente
          </Button>
          
          <div className="text-sm text-gray-500">
            <p>💡 <strong>Dica:</strong> Alguns recursos podem estar disponíveis offline</p>
          </div>
        </div>
        
        <div className="mt-8 p-4 bg-white rounded-lg border border-gray-200">
          <h3 className="font-medium mb-2 text-gray-900">Recursos Offline</h3>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>• Ver seus links salvos</li>
            <li>• Acessar páginas visitadas recentemente</li>
            <li>• Navegar pelo app básico</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

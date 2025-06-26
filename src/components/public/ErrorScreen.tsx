
import { Button } from "@/components/ui/button";
import { Globe, WifiOff, RefreshCw, ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";

interface ErrorScreenProps {
  error: string;
  retry: () => void;
  retryCount: number;
  username?: string;
}

export const ErrorScreen = ({ error, retry, retryCount, username }: ErrorScreenProps) => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const isConnectionError = error.includes('Timeout') || error.includes('Conexão') || !isOnline;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 flex items-center justify-center p-4">
      <div className="text-center space-y-6 max-w-md">
        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto">
          {isConnectionError ? (
            <WifiOff className="w-12 h-12 text-gray-400" />
          ) : (
            <Globe className="w-12 h-12 text-gray-400" />
          )}
        </div>
        
        <div className="space-y-2">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
            {isConnectionError ? 'Conexão Instável' : 'Página não encontrada'}
          </h1>
          <p className="text-gray-600 text-sm md:text-base">
            {isConnectionError ? (
              'Verifique sua conexão com a internet'
            ) : error.includes('não encontrado') ? (
              <>O usuário <span className="font-mono bg-gray-100 px-2 py-1 rounded text-xs md:text-sm">@{username}</span> não foi encontrado.</>
            ) : (
              error
            )}
          </p>
          
          {retryCount > 0 && (
            <p className="text-xs text-gray-500">
              Tentativa {retryCount} de 3
            </p>
          )}
          
          {!isOnline && (
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-3 mt-4">
              <p className="text-orange-700 text-sm">
                📱 Você está offline. Verifique sua conexão.
              </p>
            </div>
          )}
        </div>

        <div className="space-y-3">
          {isConnectionError && (
            <Button 
              onClick={retry}
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 w-full md:w-auto"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Tentar Novamente
            </Button>
          )}
          
          <Button asChild variant="outline" className="w-full md:w-auto">
            <a href="/">
              <ArrowRight className="w-4 h-4 mr-2" />
              {isConnectionError ? 'Voltar ao Início' : 'Criar Minha Página'}
            </a>
          </Button>
          
          {!isConnectionError && (
            <p className="text-xs md:text-sm text-gray-500">
              Crie sua página personalizada gratuitamente
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

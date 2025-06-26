
import { useState, useEffect } from 'react';

export function useSlowConnection() {
  const [isSlowConnection, setIsSlowConnection] = useState(false);

  useEffect(() => {
    // Detectar conexão lenta usando Network Information API
    if ('connection' in navigator) {
      const connection = (navigator as any).connection;
      
      const checkConnection = () => {
        const slowConnections = ['slow-2g', '2g', '3g'];
        const isSlow = slowConnections.includes(connection.effectiveType) || 
                      connection.downlink < 1.5;
        setIsSlowConnection(isSlow);
      };

      checkConnection();
      connection.addEventListener('change', checkConnection);
      
      return () => {
        connection.removeEventListener('change', checkConnection);
      };
    }

    // Fallback: detectar através de tempo de carregamento
    const startTime = performance.now();
    const img = new Image();
    img.onload = () => {
      const loadTime = performance.now() - startTime;
      setIsSlowConnection(loadTime > 1000); // Se demorar mais de 1s para carregar 1px
    };
    img.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
  }, []);

  return isSlowConnection;
}
